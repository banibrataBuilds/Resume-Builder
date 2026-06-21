import { useState, useEffect, useRef } from 'react';
import './App.css';
import { Download, Plus, Trash2, LogOut, LayoutDashboard, Save, User, Briefcase, GraduationCap, Code, LayoutTemplate, FileText, ChevronDown } from 'lucide-react';
import html2pdf from 'html2pdf.js';

import { supabase } from './lib/supabase';
import AuthModal from './components/AuthModal';
import Dashboard from './components/Dashboard';
import AnimatedBackground from './components/AnimatedBackground';

import TemplatePlain from './components/TemplatePlain';
import TemplateModern from './components/TemplateModern';
import TemplateMinimalist from './components/TemplateMinimalist';
import TemplateCreative from './components/TemplateCreative';
import TemplateElegant from './components/TemplateElegant';

const defaultData = {
  personal: {
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 234 567 8900',
    address: 'New York, NY',
    linkedin: 'linkedin.com/in/johndoe',
  },
  education: [
    { id: 1, degree: 'B.S. Computer Science', institution: 'University of Technology', year: '2018 - 2022' }
  ],
  experience: [
    { id: 1, jobTitle: 'Software Engineer', company: 'Tech Corp', duration: '2022 - Present', description: 'Developed modern web applications. Improved load times by 20% through optimization techniques.' }
  ],
  skills: 'JavaScript, React, Node.js, CSS, HTML, Python, Git'
};

const TEMPLATE_OPTIONS = [
  { id: 'modern', label: 'Modern' },
  { id: 'plain', label: 'Plain (Classic)' },
  { id: 'minimalist', label: 'Minimalist' },
  { id: 'creative', label: 'Creative' },
  { id: 'elegant', label: 'Elegant' }
];

function App() {
  const [currentView, setCurrentView] = useState('builder'); // 'builder' | 'dashboard'
  const [data, setData] = useState(defaultData);
  const [template, setTemplate] = useState(''); // Default empty to show "Choose Template"
  const [session, setSession] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentResumeId, setCurrentResumeId] = useState(null);
  const [resumeTitle, setResumeTitle] = useState('My Awesome Resume');
  const [isSaving, setIsSaving] = useState(false);

  // Custom dropdown state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const resumeRef = useRef(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session && currentView === 'dashboard') {
        setCurrentView('builder');
      }
    });

    return () => subscription.unsubscribe();
  }, [currentView]);

  // Click outside listener for custom dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePersonalChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({
      ...prev,
      personal: { ...prev.personal, [name]: value }
    }));
  };

  const handleSkillsChange = (e) => {
    setData(prev => ({ ...prev, skills: e.target.value }));
  };

  const handleArrayChange = (section, id, field, value) => {
    setData(prev => ({
      ...prev,
      [section]: prev[section].map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  const addArrayItem = (section, defaultItem) => {
    setData(prev => ({
      ...prev,
      [section]: [...prev[section], { ...defaultItem, id: Date.now() }]
    }));
  };

  const removeArrayItem = (section, id) => {
    setData(prev => ({
      ...prev,
      [section]: prev[section].filter(item => item.id !== id)
    }));
  };

  const handleDownloadClick = () => {
    if (!template) {
      alert("Please choose a template first.");
      return;
    }
    if (!session) {
      setShowAuthModal(true);
    } else {
      executeDownload();
    }
  };

  const executeDownload = () => {
    const element = resumeRef.current;
    const opt = {
      margin:       0,
      filename:     `${data.personal.fullName.replace(/\s+/g, '_')}_Resume.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  const handleAuthSuccess = (newSession) => {
    setSession(newSession);
    setShowAuthModal(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const handleSaveResume = async () => {
    if (!template) {
      alert("Please select a template before saving.");
      return;
    }
    if (!session) {
      setShowAuthModal(true);
      return;
    }

    setIsSaving(true);
    
    try {
      // 1. Generate PDF Blob
      const element = resumeRef.current;
      const opt = {
        margin:       0,
        filename:     `${data.personal.fullName.replace(/\s+/g, '_')}_Resume.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
      };

      const pdfBlob = await html2pdf().set(opt).from(element).output('blob');

      // 2. Upload PDF to Supabase Storage
      const fileName = `${session.user.id}/${Date.now()}_resume.pdf`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('resumes_pdfs')
        .upload(fileName, pdfBlob, {
          contentType: 'application/pdf',
          upsert: true
        });

      if (uploadError) throw uploadError;

      // 3. Get Public URL
      const { data: urlData } = supabase.storage.from('resumes_pdfs').getPublicUrl(fileName);
      const pdfUrl = urlData.publicUrl;

      // 4. Save to Database
      const resumePayload = {
        user_id: session.user.id,
        title: resumeTitle || `${data.personal.fullName || 'My'} Resume`,
        content: data,
        template_id: template,
        pdf_url: pdfUrl,
        updated_at: new Date()
      };

      if (currentResumeId) {
        // Update existing
        const { error } = await supabase
          .from('resumes')
          .update(resumePayload)
          .eq('id', currentResumeId);
        if (error) throw error;
        alert('Resume and PDF updated successfully!');
      } else {
        // Create new
        const { data: newData, error } = await supabase
          .from('resumes')
          .insert([resumePayload])
          .select()
          .single();
        if (error) throw error;
        setCurrentResumeId(newData.id);
        alert('Resume and PDF saved successfully!');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving resume: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const loadResumeFromDashboard = (savedResume) => {
    setData(savedResume.content);
    setTemplate(savedResume.template_id);
    setCurrentResumeId(savedResume.id);
    setResumeTitle(savedResume.title);
    setCurrentView('builder');
  };

  const renderTemplate = () => {
    if (!template) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#64748b', textAlign: 'center', padding: '2rem' }}>
          <LayoutTemplate size={64} color="#cbd5e1" style={{ marginBottom: '1.5rem', animation: 'fadeIn 0.5s ease' }} />
          <h2 style={{ color: '#475569', fontSize: '1.5rem', marginBottom: '0.5rem', fontFamily: 'Outfit' }}>No Template Selected</h2>
          <p style={{ maxWidth: '300px', lineHeight: '1.6' }}>Please choose a template from the dropdown menu to preview your resume.</p>
        </div>
      );
    }

    switch(template) {
      case 'plain': return <TemplatePlain data={data} />;
      case 'modern': return <TemplateModern data={data} />;
      case 'minimalist': return <TemplateMinimalist data={data} />;
      case 'creative': return <TemplateCreative data={data} />;
      case 'elegant': return <TemplateElegant data={data} />;
      default: return null;
    }
  };

  const getSelectedTemplateLabel = () => {
    const found = TEMPLATE_OPTIONS.find(t => t.id === template);
    return found ? found.label : 'Choose Template';
  };

  if (currentView === 'dashboard') {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'transparent' }}>
        <AnimatedBackground />
        <div id="cursor-glow"></div>
        <div style={{ padding: '15px 30px', background: 'rgba(255, 255, 255, 0.4)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
          <h2 style={{ margin: 0, color: '#4f46e5', display: 'flex', alignItems: 'center', gap: '8px' }}>
             Resume Builder
          </h2>
          <div style={{ display: 'flex', gap: '15px' }}>
            <button className="btn btn-primary" onClick={() => { setData(defaultData); setCurrentResumeId(null); setResumeTitle('My Awesome Resume'); setTemplate(''); setCurrentView('builder'); }}>
              <Plus size={18} /> New Resume
            </button>
            <button className="btn btn-secondary" onClick={handleSignOut}>
              <LogOut size={18} /> Sign Out
            </button>
          </div>
        </div>
        <Dashboard session={session} onEditResume={loadResumeFromDashboard} />
      </div>
    );
  }

  return (
    <div className="app-container">
      <AnimatedBackground />
      <div id="cursor-glow"></div>
      
      {showAuthModal && (
        <AuthModal 
          onClose={() => setShowAuthModal(false)} 
          onSuccess={handleAuthSuccess} 
        />
      )}

      {/* LEFT: FORM */}
      <div className="form-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem', position: 'relative', zIndex: 50 }}>
          <div>
            <h1 className="section-title" style={{ margin: 0, border: 'none', padding: 0 }}>Resume Builder</h1>
            <p style={{ color: '#64748b', margin: '0.5rem 0 0 0' }}>Craft your perfect resume.</p>
          </div>
          
          {/* CUSTOM DROPDOWN */}
          <div className="form-group" style={{ margin: 0, minWidth: '220px' }} ref={dropdownRef}>
            <div 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              style={{ 
                position: 'relative', 
                display: 'flex', 
                alignItems: 'center',
                padding: '0.85rem 1rem', 
                borderRadius: '0.75rem', 
                border: isDropdownOpen ? '1px solid #4f46e5' : '1px solid rgba(226, 232, 240, 0.8)', 
                backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                backdropFilter: 'blur(10px)',
                fontSize: '0.95rem', 
                cursor: 'pointer', 
                fontWeight: '600', 
                color: template ? '#4f46e5' : '#64748b',
                boxShadow: isDropdownOpen ? '0 0 0 4px rgba(79, 70, 229, 0.1)' : '0 4px 15px -3px rgba(0, 0, 0, 0.05)',
                transition: 'all 0.3s ease'
              }}
            >
              <LayoutTemplate size={18} color={template ? "#4f46e5" : "#94a3b8"} style={{ marginRight: '10px' }} />
              <span style={{ flex: 1 }}>{getSelectedTemplateLabel()}</span>
              <ChevronDown 
                size={18} 
                style={{ 
                  transition: 'transform 0.3s ease', 
                  transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  color: '#94a3b8'
                }} 
              />
            </div>

            {/* DROPDOWN MENU */}
            {isDropdownOpen && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                left: 0,
                right: 0,
                backgroundColor: 'rgba(255, 255, 255, 0.98)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(226, 232, 240, 0.8)',
                borderRadius: '0.75rem',
                boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.15)',
                overflow: 'hidden',
                animation: 'slideUp 0.2s ease-out forwards',
                zIndex: 100
              }}>
                {TEMPLATE_OPTIONS.map((opt) => (
                  <div
                    key={opt.id}
                    onClick={() => {
                      setTemplate(opt.id);
                      setIsDropdownOpen(false);
                    }}
                    style={{
                      padding: '0.85rem 1.25rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      color: template === opt.id ? '#4f46e5' : '#1e293b',
                      backgroundColor: template === opt.id ? 'rgba(79, 70, 229, 0.05)' : 'transparent',
                      fontWeight: template === opt.id ? '600' : '500',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (template !== opt.id) {
                        e.target.style.backgroundColor = 'rgba(241, 245, 249, 0.8)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (template !== opt.id) {
                        e.target.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    <div style={{ 
                      width: '8px', 
                      height: '8px', 
                      borderRadius: '50%', 
                      backgroundColor: template === opt.id ? '#4f46e5' : 'transparent',
                      transition: 'background-color 0.2s ease'
                    }}></div>
                    {opt.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Document Title Settings */}
        <div className="form-group-section">
          <h2>
            <FileText size={22} color="#4f46e5" />
            Document Settings
          </h2>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Resume Name (For Dashboard)</label>
            <input 
              type="text" 
              value={resumeTitle} 
              onChange={(e) => setResumeTitle(e.target.value)} 
              placeholder="e.g. Software Engineer Application"
            />
          </div>
        </div>

        {/* Personal Details */}
        <div className="form-group-section">
          <h2>
            <User size={22} color="#ec4899" />
            Personal Details
          </h2>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" name="fullName" value={data.personal.fullName} onChange={handlePersonalChange} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" value={data.personal.email} onChange={handlePersonalChange} />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input type="text" name="phone" value={data.personal.phone} onChange={handlePersonalChange} />
            </div>
          </div>
          <div className="form-group">
            <label>Address</label>
            <input type="text" name="address" value={data.personal.address} onChange={handlePersonalChange} />
          </div>
          <div className="form-group">
            <label>LinkedIn / Portfolio</label>
            <input type="text" name="linkedin" value={data.personal.linkedin} onChange={handlePersonalChange} />
          </div>
        </div>

        {/* Experience */}
        <div className="form-group-section">
          <h2>
            <Briefcase size={22} color="#8b5cf6" />
            Experience
          </h2>
          {data.experience.map((exp) => (
            <div key={exp.id} className="item-card">
              <button className="btn btn-danger item-actions" onClick={() => removeArrayItem('experience', exp.id)}>
                <Trash2 size={16} />
              </button>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Job Title</label>
                  <input type="text" value={exp.jobTitle} onChange={e => handleArrayChange('experience', exp.id, 'jobTitle', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Company</label>
                  <input type="text" value={exp.company} onChange={e => handleArrayChange('experience', exp.id, 'company', e.target.value)} />
                </div>
              </div>
              <div className="form-group">
                <label>Duration</label>
                <input type="text" value={exp.duration} onChange={e => handleArrayChange('experience', exp.id, 'duration', e.target.value)} placeholder="e.g. 2020 - 2023" />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea rows="4" value={exp.description} onChange={e => handleArrayChange('experience', exp.id, 'description', e.target.value)}></textarea>
              </div>
            </div>
          ))}
          <button className="btn btn-secondary" style={{ width: '100%', padding: '1rem' }} onClick={() => addArrayItem('experience', { jobTitle: '', company: '', duration: '', description: '' })}>
            <Plus size={18} color="#4f46e5" /> Add Experience
          </button>
        </div>

        {/* Education */}
        <div className="form-group-section">
          <h2>
            <GraduationCap size={22} color="#10b981" />
            Education
          </h2>
          {data.education.map((edu) => (
            <div key={edu.id} className="item-card">
              <button className="btn btn-danger item-actions" onClick={() => removeArrayItem('education', edu.id)}>
                <Trash2 size={16} />
              </button>
              <div className="form-group">
                <label>Degree</label>
                <input type="text" value={edu.degree} onChange={e => handleArrayChange('education', edu.id, 'degree', e.target.value)} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Institution</label>
                  <input type="text" value={edu.institution} onChange={e => handleArrayChange('education', edu.id, 'institution', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Year</label>
                  <input type="text" value={edu.year} onChange={e => handleArrayChange('education', edu.id, 'year', e.target.value)} />
                </div>
              </div>
            </div>
          ))}
          <button className="btn btn-secondary" style={{ width: '100%', padding: '1rem' }} onClick={() => addArrayItem('education', { degree: '', institution: '', year: '' })}>
            <Plus size={18} color="#4f46e5" /> Add Education
          </button>
        </div>

        {/* Skills */}
        <div className="form-group-section">
          <h2>
            <Code size={22} color="#f59e0b" />
            Skills
          </h2>
          <div className="form-group">
            <label>List your skills (comma separated)</label>
            <textarea rows="3" value={data.skills} onChange={handleSkillsChange} placeholder="React, Node.js, Design, Communication..."></textarea>
          </div>
        </div>

        {/* Generate Save Button */}
        <div style={{ marginTop: '3rem', marginBottom: '3rem' }}>
          <button 
            className="btn btn-primary" 
            style={{ width: '100%', fontSize: '1.15rem', padding: '1.25rem', borderRadius: '1rem' }} 
            onClick={handleSaveResume}
            disabled={isSaving}
          >
            <Save size={22} /> {isSaving ? 'Saving...' : 'Save & Generate Resume'}
          </button>
        </div>
      </div>

      {/* RIGHT: PREVIEW */}
      <div className="preview-section">
        <div className="controls-bar" style={{ justifyContent: 'space-between', gap: '10px' }}>
          <div>
            <span style={{ fontWeight: '600', color: '#0f172a', marginRight: '10px' }}>Preview</span>
            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Live rendering</span>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            {session && (
              <>
                <button className="btn btn-secondary" onClick={() => setCurrentView('dashboard')} style={{ padding: '0.6rem 1rem' }}>
                  <LayoutDashboard size={18} color="#4f46e5" /> Dashboard
                </button>
                <button className="btn btn-secondary" onClick={handleSignOut} title="Sign Out" style={{ padding: '0.6rem' }}>
                  <LogOut size={18} color="#64748b" />
                </button>
              </>
            )}
            <button className="btn btn-primary" onClick={handleDownloadClick} style={{ padding: '0.6rem 1rem' }}>
              <Download size={18} /> {session ? 'Download PDF' : 'Sign in to Download'}
            </button>
          </div>
        </div>

        <div className="resume-document">
          <div ref={resumeRef} style={{ width: '100%', height: '100%' }}>
            {renderTemplate()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

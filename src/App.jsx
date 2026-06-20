import { useState, useEffect, useRef } from 'react';
import './App.css';
import { Download, Plus, Trash2, LogOut, LayoutDashboard, Save } from 'lucide-react';
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

function App() {
  const [currentView, setCurrentView] = useState('builder'); // 'builder' | 'dashboard'
  const [data, setData] = useState(defaultData);
  const [template, setTemplate] = useState('modern');
  const [session, setSession] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentResumeId, setCurrentResumeId] = useState(null);
  const [resumeTitle, setResumeTitle] = useState('My Awesome Resume');
  const [isSaving, setIsSaving] = useState(false);

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

  // Cursor glow effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      const glow = document.getElementById('cursor-glow');
      if (glow) {
        // Center the 600x600 div on the cursor
        glow.style.transform = `translate(${e.clientX - 300}px, ${e.clientY - 300}px)`;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
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
    switch(template) {
      case 'plain': return <TemplatePlain data={data} />;
      case 'modern': return <TemplateModern data={data} />;
      case 'minimalist': return <TemplateMinimalist data={data} />;
      case 'creative': return <TemplateCreative data={data} />;
      case 'elegant': return <TemplateElegant data={data} />;
      default: return <TemplateModern data={data} />;
    }
  };

  if (currentView === 'dashboard') {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'transparent' }}>
        <AnimatedBackground />
        <div id="cursor-glow"></div>
        <div style={{ padding: '15px 30px', background: 'rgba(255, 255, 255, 0.4)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
          <h2 style={{ margin: 0, color: '#2563eb' }}>Resume Builder</h2>
          <div style={{ display: 'flex', gap: '15px' }}>
            <button className="btn btn-primary" onClick={() => { setData(defaultData); setCurrentResumeId(null); setResumeTitle('My Awesome Resume'); setCurrentView('builder'); }}>
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
          <h1 className="section-title" style={{ borderBottom: 'none', margin: 0, padding: 0 }}>Resume Builder</h1>
          
          <div className="form-group" style={{ margin: 0 }}>
            <select 
              value={template} 
              onChange={(e) => setTemplate(e.target.value)}
              style={{ padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #cbd5e1', backgroundColor: '#fff', fontSize: '1rem', cursor: 'pointer', fontWeight: '600', color: '#1e293b' }}
            >
              <option value="modern">Modern (Blue Sidebar)</option>
              <option value="plain">Plain (Classic B&W)</option>
              <option value="minimalist">Minimalist (Sage Green)</option>
              <option value="creative">Creative (Purple & Coral)</option>
              <option value="elegant">Elegant (Charcoal & Gold)</option>
            </select>
          </div>
        </div>
        
        {/* Personal Details */}
        <div className="form-group-section">
          <div className="form-group" style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem', border: '1px solid #cbd5e1' }}>
            <label style={{ color: '#0f172a', fontWeight: '600' }}>Resume Name (For Dashboard)</label>
            <input 
              type="text" 
              value={resumeTitle} 
              onChange={(e) => setResumeTitle(e.target.value)} 
              placeholder="e.g. Software Engineer Application"
              style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid #cbd5e1', marginTop: '0.5rem' }}
            />
          </div>

          <h2>Personal Details</h2>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" name="fullName" value={data.personal.fullName} onChange={handlePersonalChange} />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={data.personal.email} onChange={handlePersonalChange} />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input type="text" name="phone" value={data.personal.phone} onChange={handlePersonalChange} />
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
          <h2>Experience</h2>
          {data.experience.map((exp) => (
            <div key={exp.id} className="item-card">
              <button className="btn btn-danger item-actions" onClick={() => removeArrayItem('experience', exp.id)}>
                <Trash2 size={16} />
              </button>
              <div className="form-group">
                <label>Job Title</label>
                <input type="text" value={exp.jobTitle} onChange={e => handleArrayChange('experience', exp.id, 'jobTitle', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Company</label>
                <input type="text" value={exp.company} onChange={e => handleArrayChange('experience', exp.id, 'company', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Duration</label>
                <input type="text" value={exp.duration} onChange={e => handleArrayChange('experience', exp.id, 'duration', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea rows="3" value={exp.description} onChange={e => handleArrayChange('experience', exp.id, 'description', e.target.value)}></textarea>
              </div>
            </div>
          ))}
          <button className="btn btn-secondary" onClick={() => addArrayItem('experience', { jobTitle: '', company: '', duration: '', description: '' })}>
            <Plus size={16} /> Add Experience
          </button>
        </div>

        {/* Education */}
        <div className="form-group-section" style={{ marginTop: '2rem' }}>
          <h2>Education</h2>
          {data.education.map((edu) => (
            <div key={edu.id} className="item-card">
              <button className="btn btn-danger item-actions" onClick={() => removeArrayItem('education', edu.id)}>
                <Trash2 size={16} />
              </button>
              <div className="form-group">
                <label>Degree</label>
                <input type="text" value={edu.degree} onChange={e => handleArrayChange('education', edu.id, 'degree', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Institution</label>
                <input type="text" value={edu.institution} onChange={e => handleArrayChange('education', edu.id, 'institution', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Year</label>
                <input type="text" value={edu.year} onChange={e => handleArrayChange('education', edu.id, 'year', e.target.value)} />
              </div>
            </div>
          ))}
          <button className="btn btn-secondary" onClick={() => addArrayItem('education', { degree: '', institution: '', year: '' })}>
            <Plus size={16} /> Add Education
          </button>
        </div>

        {/* Skills */}
        <div className="form-group-section" style={{ marginTop: '2rem' }}>
          <h2>Skills</h2>
          <div className="form-group">
            <label>List your skills (comma separated)</label>
            <textarea rows="3" value={data.skills} onChange={handleSkillsChange}></textarea>
          </div>
        </div>

        {/* Generate Save Button */}
        <div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '2px solid #e2e8f0' }}>
          <button 
            className="btn btn-primary" 
            style={{ width: '100%', fontSize: '1.1rem', padding: '1rem' }} 
            onClick={handleSaveResume}
            disabled={isSaving}
          >
            <Save size={20} /> {isSaving ? 'Saving...' : 'Generate & Save Resume'}
          </button>
        </div>
      </div>

      {/* RIGHT: PREVIEW */}
      <div className="preview-section">
        <div className="controls-bar" style={{ justifyContent: 'flex-end', gap: '10px' }}>
          {session && (
            <>
              <button className="btn btn-secondary" onClick={() => setCurrentView('dashboard')}>
                <LayoutDashboard size={18} /> My Dashboard
              </button>
              <button className="btn btn-secondary" onClick={handleSignOut} title="Sign Out">
                <LogOut size={18} />
              </button>
            </>
          )}
          <button className="btn btn-primary" onClick={handleDownloadClick}>
            <Download size={18} /> {session ? 'Download PDF' : 'Sign in to Download'}
          </button>
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

import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Edit2, Trash2, FileText, Loader2, Download, Clock, LayoutTemplate } from 'lucide-react';

const Dashboard = ({ session, onEditResume }) => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('resumes')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setResumes(data);
    }
    setLoading(false);
  };

  const deleteResume = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resume?')) return;
    
    const { error } = await supabase
      .from('resumes')
      .delete()
      .eq('id', id);

    if (!error) {
      setResumes(resumes.filter(r => r.id !== id));
    } else {
      alert('Error deleting resume');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}>
        <Loader2 className="animate-spin" size={48} color="var(--primary, #4f46e5)" style={{animation: 'spin 1s linear infinite'}} />
        <p style={{ marginTop: '1rem', color: '#64748b', fontSize: '1rem', fontWeight: '500' }}>Loading your resumes...</p>
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes spin { 100% { transform: rotate(360deg); } }
        `}} />
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem 5%', width: '100%', maxWidth: '1400px', margin: '0 auto', overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', borderBottom: '2px solid rgba(0,0,0,0.05)', paddingBottom: '1.5rem' }}>
        <div>
          <h1 style={{ 
            color: 'var(--text-main, #0f172a)', 
            margin: '0 0 0.5rem 0', 
            fontSize: '2.5rem', 
            fontWeight: '700',
            fontFamily: "'Outfit', sans-serif",
            background: 'linear-gradient(to right, #4f46e5, #ec4899)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            My Resumes
          </h1>
          <p style={{ color: '#64748b', margin: 0, fontSize: '1.1rem' }}>Manage and download your saved creations.</p>
        </div>
      </div>
      
      {resumes.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '4rem 2rem', 
          background: 'rgba(255, 255, 255, 0.7)', 
          backdropFilter: 'blur(16px)', 
          borderRadius: '1.5rem', 
          border: '1px solid rgba(255, 255, 255, 0.8)', 
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.05)',
          animation: 'slideUp 0.5s ease-out'
        }}>
          <div style={{ background: 'linear-gradient(135deg, #e0e7ff, #f3e8ff)', width: '96px', height: '96px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
            <FileText size={48} color="#4f46e5" />
          </div>
          <h3 style={{ color: '#0f172a', margin: '0 0 0.5rem 0', fontSize: '1.5rem', fontWeight: '600', fontFamily: "'Outfit', sans-serif" }}>No resumes yet</h3>
          <p style={{ color: '#64748b', fontSize: '1.1rem', maxWidth: '400px', margin: '0 auto 2rem auto' }}>You haven't saved any resumes. Head back to the builder to create your first masterpiece.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '2rem' }}>
          {resumes.map((resume, index) => (
            <div key={resume.id} style={{ 
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(20px)',
              borderRadius: '1.5rem', 
              padding: '1.75rem', 
              boxShadow: '0 10px 30px -10px rgba(31, 38, 135, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.8)',
              display: 'flex',
              flexDirection: 'column',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              animation: `slideUp 0.5s ease-out ${index * 0.1}s both`,
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(79, 70, 229, 0.15)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 1)';
              e.currentTarget.style.borderColor = 'rgba(79, 70, 229, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 10px 30px -10px rgba(31, 38, 135, 0.1)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.8)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.8)';
            }}>
              
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: 'linear-gradient(90deg, #4f46e5, #ec4899)' }}></div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                <h3 style={{ margin: 0, color: '#0f172a', fontSize: '1.4rem', fontWeight: '700', fontFamily: "'Outfit', sans-serif", lineHeight: '1.3' }}>
                  {resume.title || 'Untitled Resume'}
                </h3>
                <button 
                  onClick={() => deleteResume(resume.id)}
                  style={{ 
                    padding: '8px', 
                    backgroundColor: '#fff1f2', 
                    color: '#e11d48', 
                    border: '1px solid #ffe4e6', 
                    borderRadius: '50%', 
                    cursor: 'pointer', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    transition: 'all 0.2s'
                  }}
                  title="Delete"
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#e11d48'; e.currentTarget.style.color = 'white'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#fff1f2'; e.currentTarget.style.color = '#e11d48'; }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontSize: '0.9rem' }}>
                  <LayoutTemplate size={16} color="#8b5cf6" />
                  <span style={{ fontWeight: '500', textTransform: 'capitalize' }}>
                    {resume.template_id} Template
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '0.9rem' }}>
                  <Clock size={16} color="#64748b" />
                  <span>Last updated: {new Date(resume.updated_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '12px', marginTop: 'auto' }}>
                <button 
                  onClick={() => onEditResume(resume)}
                  style={{ 
                    flex: 1, 
                    padding: '0.75rem', 
                    background: 'linear-gradient(135deg, #4f46e5, #818cf8)', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '0.75rem', 
                    cursor: 'pointer', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: '8px',
                    fontWeight: '600',
                    fontSize: '0.95rem',
                    transition: 'all 0.2s',
                    boxShadow: '0 4px 12px rgba(79, 70, 229, 0.2)'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(79, 70, 229, 0.3)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(79, 70, 229, 0.2)'; }}
                >
                  <Edit2 size={18} /> Edit
                </button>
                
                {resume.pdf_url && (
                  <a 
                    href={resume.pdf_url} 
                    target="_blank" 
                    rel="noreferrer"
                    style={{ 
                      flex: 1, 
                      padding: '0.75rem', 
                      backgroundColor: 'white', 
                      color: '#0f172a', 
                      border: '1px solid #cbd5e1', 
                      borderRadius: '0.75rem', 
                      cursor: 'pointer', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      gap: '8px', 
                      textDecoration: 'none', 
                      fontSize: '0.95rem',
                      fontWeight: '600',
                      transition: 'all 0.2s',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.02)'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc'; e.currentTarget.style.borderColor = '#94a3b8'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    <Download size={18} /> View PDF
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;

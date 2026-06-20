import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Edit2, Trash2, FileText, Loader2 } from 'lucide-react';

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
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}>
        <Loader2 className="lucide-spin" size={48} color="#2563eb" />
      </div>
    );
  }

  return (
    <div style={{ padding: '40px', width: '100%', maxWidth: '1200px', margin: '0 auto', overflowY: 'auto' }}>
      <h1 style={{ color: '#0f172a', marginBottom: '30px' }}>My Saved Resumes</h1>
      
      {resumes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: 'rgba(255, 255, 255, 0.6)', backdropFilter: 'blur(10px)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.5)', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.07)' }}>
          <FileText size={56} color="#94a3b8" style={{ marginBottom: '20px' }} />
          <h3 style={{ color: '#334155', marginTop: 0, fontSize: '1.25rem' }}>No resumes found</h3>
          <p style={{ color: '#64748b', fontSize: '1.05rem' }}>Go back to the builder and generate your first resume!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {resumes.map(resume => (
            <div key={resume.id} style={{ 
              background: 'rgba(255, 255, 255, 0.6)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px', 
              padding: '24px', 
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
              border: '1px solid rgba(255, 255, 255, 0.5)',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 15px 35px rgba(31, 38, 135, 0.1)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 32px 0 rgba(31, 38, 135, 0.07)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.6)';
            }}>
              <h3 style={{ margin: '0 0 12px 0', color: '#1e293b', fontSize: '1.25rem', fontWeight: '600' }}>{resume.title}</h3>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <span style={{ background: 'rgba(241, 245, 249, 0.8)', color: '#475569', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: '500', textTransform: 'capitalize' }}>
                  {resume.template_id} template
                </span>
              </div>
              <p style={{ margin: '0 0 20px 0', fontSize: '0.85rem', color: '#94a3b8' }}>
                Last updated: {new Date(resume.updated_at).toLocaleDateString()}
              </p>
              
              <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                <button 
                  onClick={() => onEditResume(resume)}
                  style={{ flex: 1, padding: '8px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}
                >
                  <Edit2 size={16} /> Edit
                </button>
                {resume.pdf_url && (
                  <a 
                    href={resume.pdf_url} 
                    target="_blank" 
                    rel="noreferrer"
                    style={{ flex: 1, padding: '8px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', textDecoration: 'none', fontSize: '0.9rem' }}
                  >
                    View PDF
                  </a>
                )}
                <button 
                  onClick={() => deleteResume(resume.id)}
                  style={{ padding: '8px', backgroundColor: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;

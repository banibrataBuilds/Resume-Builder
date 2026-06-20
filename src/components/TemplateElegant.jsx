import React from 'react';

const styles = {
  container: {
    padding: '50px',
    fontFamily: '"Merriweather", "Times New Roman", serif',
    color: '#1e293b',
    backgroundColor: '#fff',
    minHeight: '100%',
    boxSizing: 'border-box',
    border: '8px solid #f8fafc',
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px',
  },
  name: {
    fontSize: '32pt',
    fontWeight: '700',
    margin: '0 0 15px 0',
    color: '#0f172a',
    letterSpacing: '1px',
  },
  contact: {
    fontSize: '10.5pt',
    color: '#475569',
    display: 'flex',
    justifyContent: 'center',
    gap: '15px',
    flexWrap: 'wrap',
    fontFamily: '"Inter", sans-serif',
  },
  divider: {
    border: 'none',
    borderTop: '1px solid #cbd5e1',
    borderBottom: '1px solid #cbd5e1',
    height: '2px',
    margin: '30px 0',
  },
  section: {
    marginBottom: '30px',
  },
  sectionTitle: {
    fontSize: '16pt',
    fontWeight: '700',
    color: '#b45309', // Bronze/Gold
    textTransform: 'uppercase',
    letterSpacing: '2px',
    textAlign: 'center',
    marginBottom: '20px',
    marginTop: '0',
  },
  item: {
    marginBottom: '25px',
  },
  itemHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: '5px',
  },
  itemTitle: {
    fontWeight: '700',
    fontSize: '13pt',
    color: '#1e293b',
  },
  itemDate: {
    fontSize: '10pt',
    color: '#64748b',
    fontFamily: '"Inter", sans-serif',
    fontWeight: '500',
  },
  itemSub: {
    fontSize: '11pt',
    color: '#b45309', // Bronze/Gold
    fontStyle: 'italic',
    marginBottom: '10px',
  },
  text: {
    fontSize: '10.5pt',
    margin: '0',
    lineHeight: '1.7',
    color: '#334155',
    fontFamily: '"Inter", sans-serif',
  },
  skills: {
    fontSize: '11pt',
    lineHeight: '1.8',
    color: '#334155',
    fontFamily: '"Inter", sans-serif',
    textAlign: 'center',
    maxWidth: '80%',
    margin: '0 auto',
  }
};

const TemplateElegant = ({ data }) => {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.name}>{data.personal.fullName || 'Your Name'}</h1>
        <div style={styles.contact}>
          {data.personal.email && <span>{data.personal.email}</span>}
          {data.personal.phone && <span>• {data.personal.phone}</span>}
          {data.personal.address && <span>• {data.personal.address}</span>}
          {data.personal.linkedin && <span>• {data.personal.linkedin}</span>}
        </div>
      </header>

      <hr style={styles.divider} />

      {data.experience && data.experience.length > 0 && (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Professional Experience</h2>
          {data.experience.map(exp => (
            <div key={exp.id} style={styles.item}>
              <div style={styles.itemHeader}>
                <span style={styles.itemTitle}>{exp.jobTitle}</span>
                <span style={styles.itemDate}>{exp.duration}</span>
              </div>
              <div style={styles.itemSub}>{exp.company}</div>
              <p style={styles.text}>{exp.description}</p>
            </div>
          ))}
        </section>
      )}

      {data.education && data.education.length > 0 && (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Education</h2>
          {data.education.map(edu => (
            <div key={edu.id} style={styles.item}>
              <div style={styles.itemHeader}>
                <span style={styles.itemTitle}>{edu.degree}</span>
                <span style={styles.itemDate}>{edu.year}</span>
              </div>
              <div style={styles.itemSub}>{edu.institution}</div>
            </div>
          ))}
        </section>
      )}

      {data.skills && (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Core Competencies</h2>
          <div style={styles.skills}>{data.skills}</div>
        </section>
      )}
    </div>
  );
};

export default TemplateElegant;

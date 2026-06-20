import React from 'react';

const styles = {
  container: {
    padding: '40px',
    fontFamily: '"Inter", sans-serif',
    color: '#374151',
    backgroundColor: '#fff',
    minHeight: '100%',
    boxSizing: 'border-box',
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  name: {
    fontSize: '28pt',
    fontWeight: '300',
    letterSpacing: '2px',
    margin: '0 0 10px 0',
    color: '#111827',
    textTransform: 'uppercase',
  },
  contact: {
    fontSize: '10pt',
    color: '#4b5563',
    display: 'flex',
    justifyContent: 'center',
    gap: '15px',
    flexWrap: 'wrap',
  },
  section: {
    marginBottom: '25px',
  },
  sectionTitle: {
    fontSize: '12pt',
    fontWeight: '600',
    textTransform: 'uppercase',
    color: '#4b5563',
    letterSpacing: '1px',
    borderBottom: '1px solid #dcfce7', // Soft Sage Green
    paddingBottom: '8px',
    marginBottom: '15px',
    marginTop: '0',
  },
  item: {
    marginBottom: '20px',
  },
  itemHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: '4px',
  },
  itemTitle: {
    fontWeight: '600',
    fontSize: '12pt',
    color: '#1f2937',
  },
  itemDate: {
    fontSize: '10pt',
    color: '#6b7280',
  },
  itemSub: {
    fontSize: '11pt',
    color: '#15803d', // Darker Sage
    marginBottom: '8px',
    fontStyle: 'italic',
  },
  text: {
    fontSize: '10.5pt',
    margin: '0',
    lineHeight: '1.6',
    color: '#4b5563',
  },
  skillsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
  },
  skillTag: {
    backgroundColor: '#f0fdf4', // Very light Sage
    color: '#166534', // Dark Sage text
    padding: '6px 12px',
    borderRadius: '4px',
    fontSize: '10pt',
    border: '1px solid #bbf7d0',
  }
};

const TemplateMinimalist = ({ data }) => {
  const skillsList = data.skills ? data.skills.split(',').map(s => s.trim()).filter(Boolean) : [];

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.name}>{data.personal.fullName || 'Your Name'}</h1>
        <div style={styles.contact}>
          {data.personal.email && <span>{data.personal.email}</span>}
          {data.personal.phone && <span>{data.personal.phone}</span>}
          {data.personal.address && <span>{data.personal.address}</span>}
          {data.personal.linkedin && <span>{data.personal.linkedin}</span>}
        </div>
      </header>

      {skillsList.length > 0 && (
        <section style={styles.section}>
          <div style={styles.skillsContainer}>
            {skillsList.map((skill, index) => (
              <span key={index} style={styles.skillTag}>{skill}</span>
            ))}
          </div>
        </section>
      )}

      {data.experience && data.experience.length > 0 && (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Experience</h2>
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
    </div>
  );
};

export default TemplateMinimalist;

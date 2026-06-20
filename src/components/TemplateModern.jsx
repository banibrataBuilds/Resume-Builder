import React from 'react';

const styles = {
  container: {
    display: 'flex',
    minHeight: '100%',
    fontFamily: '"Inter", sans-serif',
    color: '#333',
    backgroundColor: '#fff',
    boxSizing: 'border-box',
  },
  sidebar: {
    width: '35%',
    backgroundColor: '#1e3a8a', // Deep Blue
    color: '#fff',
    padding: '30px',
    boxSizing: 'border-box',
  },
  main: {
    width: '65%',
    padding: '40px 30px',
    boxSizing: 'border-box',
  },
  name: {
    fontSize: '24pt',
    fontWeight: '800',
    margin: '0 0 5px 0',
    color: '#fff',
    lineHeight: '1.2',
  },
  contactItem: {
    fontSize: '10pt',
    marginBottom: '10px',
    color: '#bfdbfe',
    wordBreak: 'break-word',
  },
  sectionTitleSidebar: {
    fontSize: '14pt',
    fontWeight: '600',
    textTransform: 'uppercase',
    color: '#fff',
    borderBottom: '2px solid #3b82f6',
    paddingBottom: '5px',
    marginBottom: '15px',
    marginTop: '30px',
  },
  sectionTitleMain: {
    fontSize: '16pt',
    fontWeight: '700',
    textTransform: 'uppercase',
    color: '#1e3a8a',
    borderBottom: '2px solid #e2e8f0',
    paddingBottom: '5px',
    marginBottom: '20px',
    marginTop: '0',
  },
  item: {
    marginBottom: '20px',
  },
  itemHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: '5px',
  },
  itemTitle: {
    fontWeight: '700',
    fontSize: '12pt',
    color: '#1e293b',
  },
  itemDate: {
    fontSize: '10pt',
    color: '#2563eb',
    fontWeight: '600',
  },
  itemSub: {
    fontSize: '11pt',
    color: '#64748b',
    fontWeight: '500',
    marginBottom: '8px',
  },
  text: {
    fontSize: '10.5pt',
    margin: '0',
    lineHeight: '1.6',
    color: '#334155',
  },
  skillTag: {
    display: 'inline-block',
    backgroundColor: 'rgba(255,255,255,0.1)',
    border: '1px solid #3b82f6',
    padding: '4px 10px',
    borderRadius: '15px',
    fontSize: '9.5pt',
    margin: '0 8px 8px 0',
  }
};

const TemplateModern = ({ data }) => {
  const skillsList = data.skills ? data.skills.split(',').map(s => s.trim()).filter(Boolean) : [];

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={{ marginBottom: '40px' }}>
          <h1 style={styles.name}>{data.personal.fullName || 'Your Name'}</h1>
        </div>

        <div>
          <h2 style={styles.sectionTitleSidebar}>Contact</h2>
          {data.personal.email && <div style={styles.contactItem}>{data.personal.email}</div>}
          {data.personal.phone && <div style={styles.contactItem}>{data.personal.phone}</div>}
          {data.personal.address && <div style={styles.contactItem}>{data.personal.address}</div>}
          {data.personal.linkedin && <div style={styles.contactItem}>{data.personal.linkedin}</div>}
        </div>

        {skillsList.length > 0 && (
          <div>
            <h2 style={styles.sectionTitleSidebar}>Skills</h2>
            <div>
              {skillsList.map((skill, index) => (
                <span key={index} style={styles.skillTag}>{skill}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div style={styles.main}>
        {data.experience && data.experience.length > 0 && (
          <section style={{ marginBottom: '30px' }}>
            <h2 style={styles.sectionTitleMain}>Experience</h2>
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
          <section>
            <h2 style={styles.sectionTitleMain}>Education</h2>
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
    </div>
  );
};

export default TemplateModern;

import React from 'react';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100%',
    fontFamily: '"Outfit", "Inter", sans-serif',
    backgroundColor: '#fff',
    boxSizing: 'border-box',
  },
  header: {
    backgroundColor: '#4c1d95', // Deep Purple
    color: '#fff',
    padding: '40px 40px 20px 40px',
  },
  name: {
    fontSize: '32pt',
    fontWeight: '800',
    margin: '0 0 10px 0',
    color: '#fff',
  },
  contact: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    fontSize: '10.5pt',
    color: '#ddd6fe',
  },
  contentWrapper: {
    display: 'flex',
    flex: 1,
  },
  leftCol: {
    width: '35%',
    padding: '30px 20px 30px 40px',
    backgroundColor: '#f5f3ff', // Very light purple
  },
  rightCol: {
    width: '65%',
    padding: '30px 40px 30px 20px',
  },
  sectionTitle: {
    fontSize: '15pt',
    fontWeight: '700',
    textTransform: 'uppercase',
    color: '#4c1d95',
    marginBottom: '20px',
    marginTop: '0',
    display: 'inline-block',
    borderBottom: '3px solid #fb923c', // Coral/Orange accent
    paddingBottom: '5px',
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
    fontSize: '12.5pt',
    color: '#2e1065',
  },
  itemDate: {
    backgroundColor: '#fb923c', // Coral badge
    color: '#fff',
    padding: '3px 10px',
    borderRadius: '12px',
    fontSize: '9pt',
    fontWeight: '600',
  },
  itemSub: {
    fontSize: '11pt',
    color: '#6d28d9',
    fontWeight: '500',
    marginBottom: '8px',
  },
  text: {
    fontSize: '10.5pt',
    lineHeight: '1.6',
    color: '#475569',
    margin: '0',
  },
  skillTag: {
    display: 'inline-block',
    backgroundColor: '#fff',
    color: '#4c1d95',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '10pt',
    fontWeight: '600',
    margin: '0 10px 10px 0',
    boxShadow: '0 2px 4px rgba(76,29,149,0.1)',
  }
};

const TemplateCreative = ({ data }) => {
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

      <div style={styles.contentWrapper}>
        <div style={styles.leftCol}>
          {skillsList.length > 0 && (
            <section>
              <h2 style={styles.sectionTitle}>Skills</h2>
              <div>
                {skillsList.map((skill, index) => (
                  <span key={index} style={styles.skillTag}>{skill}</span>
                ))}
              </div>
            </section>
          )}
          
          {/* Could add education here to balance columns if desired, but we'll stick to a standard flow */}
          {data.education && data.education.length > 0 && (
            <section style={{marginTop: '30px'}}>
              <h2 style={styles.sectionTitle}>Education</h2>
              {data.education.map(edu => (
                <div key={edu.id} style={{marginBottom: '20px'}}>
                  <div style={{fontWeight: '700', color: '#2e1065', fontSize: '11pt'}}>{edu.degree}</div>
                  <div style={{color: '#fb923c', fontWeight: '600', fontSize: '9pt', margin: '4px 0'}}>{edu.year}</div>
                  <div style={{color: '#6d28d9', fontSize: '10pt'}}>{edu.institution}</div>
                </div>
              ))}
            </section>
          )}
        </div>

        <div style={styles.rightCol}>
          {data.experience && data.experience.length > 0 && (
            <section>
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
        </div>
      </div>
    </div>
  );
};

export default TemplateCreative;

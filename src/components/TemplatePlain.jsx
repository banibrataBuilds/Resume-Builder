import React from 'react';

const styles = {
  container: {
    padding: '40px',
    fontFamily: '"Times New Roman", Times, serif',
    color: '#000',
    backgroundColor: '#fff',
    minHeight: '100%',
    boxSizing: 'border-box',
  },
  header: {
    textAlign: 'center',
    borderBottom: '2px solid #000',
    paddingBottom: '20px',
    marginBottom: '20px',
  },
  name: {
    fontSize: '28pt',
    fontWeight: 'bold',
    margin: '0 0 10px 0',
    textTransform: 'uppercase',
  },
  contact: {
    fontSize: '11pt',
    margin: '0',
    lineHeight: '1.5',
  },
  section: {
    marginBottom: '20px',
  },
  sectionTitle: {
    fontSize: '14pt',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    borderBottom: '1px solid #000',
    paddingBottom: '5px',
    marginBottom: '15px',
    marginTop: '0',
  },
  item: {
    marginBottom: '15px',
  },
  itemHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    fontWeight: 'bold',
    fontSize: '12pt',
    marginBottom: '5px',
  },
  itemSub: {
    fontStyle: 'italic',
    fontSize: '11pt',
    marginBottom: '5px',
  },
  text: {
    fontSize: '11pt',
    margin: '0',
    lineHeight: '1.4',
  },
  skills: {
    fontSize: '11pt',
    lineHeight: '1.5',
  }
};

const TemplatePlain = ({ data }) => {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.name}>{data.personal.fullName || 'YOUR NAME'}</h1>
        <div style={styles.contact}>
          {data.personal.email && <span>{data.personal.email}</span>}
          {data.personal.phone && <span> | {data.personal.phone}</span>}
          {data.personal.address && <span> | {data.personal.address}</span>}
        </div>
        {data.personal.linkedin && (
          <div style={styles.contact}>{data.personal.linkedin}</div>
        )}
      </header>

      {data.experience && data.experience.length > 0 && (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Experience</h2>
          {data.experience.map(exp => (
            <div key={exp.id} style={styles.item}>
              <div style={styles.itemHeader}>
                <span>{exp.jobTitle}</span>
                <span>{exp.duration}</span>
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
                <span>{edu.degree}</span>
                <span>{edu.year}</span>
              </div>
              <div style={styles.itemSub}>{edu.institution}</div>
            </div>
          ))}
        </section>
      )}

      {data.skills && (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Skills</h2>
          <div style={styles.skills}>{data.skills}</div>
        </section>
      )}
    </div>
  );
};

export default TemplatePlain;

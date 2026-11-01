// Creates demo data the first time the app starts (only if there are no users).
const bcrypt = require('bcryptjs');
const db = require('./db');

module.exports = function seed() {
  if (db.all('users').length > 0) return;
  console.log('Seeding demo data...');

  const hash = (p) => bcrypt.hashSync(p, 10);
  const day = 24 * 3600 * 1000;
  const when = (days, hour = 17) => {
    const d = new Date(Date.now() + days * day);
    d.setHours(hour, 0, 0, 0);
    const p = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:00`;
  };
  const base = { status: 'active', linkedin: '', bio: '', skills: [], openToMentor: false, mentorTopics: '', headline: '', company: '', position: '', location: '' };

  const admin = db.insert('users', {
    ...base, name: 'Portal Admin', email: 'admin@alumni.com', password: hash('admin123'),
    role: 'admin', department: '', graduationYear: null, headline: 'Alumni Relations Office',
  });

  const alumni = [
    { name: 'Priya Raman', email: 'priya@alumni.com', department: 'Computer Science', graduationYear: 2016, headline: 'Senior Software Engineer', company: 'Zoho', position: 'Senior Engineer', location: 'Chennai', skills: ['Java', 'System Design', 'Microservices'], openToMentor: true, mentorTopics: 'Interview prep, backend careers', bio: 'Building scalable SaaS products. Happy to help juniors crack interviews and plan their first job.' },
    { name: 'Arjun Mehta', email: 'arjun@alumni.com', department: 'Information Technology', graduationYear: 2014, headline: 'Product Manager', company: 'Flipkart', position: 'Product Manager', location: 'Bengaluru', skills: ['Product', 'Analytics', 'Agile'], openToMentor: true, mentorTopics: 'Product management, MBA guidance', bio: 'From coder to PM. I enjoy talking about product thinking and career transitions.' },
    { name: 'Sneha Iyer', email: 'sneha@alumni.com', department: 'Electronics', graduationYear: 2018, headline: 'Embedded Systems Engineer', company: 'Bosch', position: 'Engineer II', location: 'Coimbatore', skills: ['Embedded C', 'IoT', 'RTOS'], openToMentor: true, mentorTopics: 'Embedded careers, higher studies abroad', bio: 'Working on automotive firmware. MS from Germany.' },
    { name: 'Karthik Subramanian', email: 'karthik@alumni.com', department: 'Mechanical', graduationYear: 2012, headline: 'Founder & CEO', company: 'TorqueWorks', position: 'Founder', location: 'Chennai', skills: ['Entrepreneurship', 'Manufacturing', 'Fundraising'], openToMentor: false, bio: 'Started a small manufacturing startup that now supplies to 40+ clients.' },
    { name: 'Divya Nair', email: 'divya@alumni.com', department: 'Computer Science', graduationYear: 2019, headline: 'Data Scientist', company: 'Amazon', position: 'Data Scientist', location: 'Hyderabad', skills: ['Python', 'Machine Learning', 'SQL'], openToMentor: true, mentorTopics: 'Data science roadmap, projects', bio: 'I work on forecasting models. Ask me about breaking into data science.' },
    { name: 'Rahul Verma', email: 'rahul@alumni.com', department: 'Business Administration', graduationYear: 2015, headline: 'Marketing Manager', company: 'Unilever', position: 'Brand Manager', location: 'Mumbai', skills: ['Marketing', 'Branding', 'Strategy'], openToMentor: false, bio: 'Consumer brands, digital marketing and campaigns.' },
  ].map((a) => db.insert('users', { ...base, ...a, password: hash('alumni123'), role: 'alumni' }));

  const students = [
    { name: 'Aarav Kumar', email: 'aarav@student.com', department: 'Computer Science', graduationYear: 2027, headline: 'Final-year CSE student', skills: ['JavaScript', 'React', 'Node.js'] },
    { name: 'Meera Pillai', email: 'meera@student.com', department: 'Information Technology', graduationYear: 2027, headline: 'Aspiring data analyst', skills: ['Python', 'Excel'] },
  ].map((s) => db.insert('users', { ...base, ...s, password: hash('student123'), role: 'student' }));

  // Events
  const ev = (title, type, days, hour, location, description, by) =>
    db.insert('events', { title, type, date: when(days, hour), location, description, createdBy: by.id });
  const e1 = ev('Annual Alumni Reunion 2026', 'Reunion', 30, 17, 'College Auditorium', 'Meet old friends, relive memories and network with batches from the last 20 years. Dinner included.', admin);
  const e2 = ev('Career in AI/ML - Webinar', 'Webinar', 7, 18, 'Online (Google Meet)', 'Divya Nair shares a practical roadmap to build a career in AI and machine learning.', alumni[4]);
  const e3 = ev('Resume & Interview Workshop', 'Workshop', 14, 10, 'Seminar Hall 2', 'Hands-on session on building strong resumes and cracking technical interviews.', alumni[0]);
  ev('Startup Meetup: From Idea to Launch', 'Meetup', 21, 16, 'Innovation Centre', 'Founders from our alumni community discuss lessons from starting up.', alumni[3]);
  db.insert('rsvps', { eventId: e1.id, userId: students[0].id });
  db.insert('rsvps', { eventId: e1.id, userId: alumni[0].id });
  db.insert('rsvps', { eventId: e2.id, userId: students[0].id });
  db.insert('rsvps', { eventId: e2.id, userId: students[1].id });
  db.insert('rsvps', { eventId: e3.id, userId: students[1].id });

  // Jobs
  const j1 = db.insert('jobs', { title: 'Software Engineer Intern', company: 'Zoho', location: 'Chennai', type: 'Internship', description: 'Work with the product engineering team on Java and web technologies. 6-month paid internship with a PPO opportunity.', applyLink: 'https://www.zoho.com/careers/', deadline: when(25).slice(0, 10), postedBy: alumni[0].id });
  db.insert('jobs', { title: 'Associate Product Manager', company: 'Flipkart', location: 'Bengaluru', type: 'Full-time', description: 'Looking for freshers with strong analytical skills and product sense. Referral available through alumni.', applyLink: '', deadline: when(40).slice(0, 10), postedBy: alumni[1].id });
  db.insert('jobs', { title: 'Embedded Firmware Engineer', company: 'Bosch', location: 'Coimbatore', type: 'Full-time', description: 'Develop firmware for automotive ECUs. Knowledge of C, RTOS and CAN protocols preferred.', applyLink: '', deadline: when(35).slice(0, 10), postedBy: alumni[2].id });
  db.insert('jobs', { title: 'Data Analyst Intern', company: 'Amazon', location: 'Hyderabad', type: 'Internship', description: 'Analyse operations data using SQL and Python. Strong problem-solving skills required.', applyLink: '', deadline: when(20).slice(0, 10), postedBy: alumni[4].id });
  db.insert('applications', { jobId: j1.id, userId: students[0].id, note: 'Final-year CSE student with Node.js and Java projects.' });

  // Connections
  db.insert('connections', { fromId: students[0].id, toId: alumni[0].id, status: 'accepted' });
  db.insert('connections', { fromId: students[1].id, toId: alumni[4].id, status: 'pending' });
  db.insert('connections', { fromId: alumni[1].id, toId: alumni[0].id, status: 'accepted' });

  // Mentoring
  db.insert('mentoring', { menteeId: students[0].id, mentorId: alumni[0].id, topic: 'Preparing for backend interviews', message: 'Hi Priya, I am in my final year and would love guidance on system design and DSA preparation.', status: 'accepted', response: 'Happy to help! Let us do a 30-minute call this weekend.' });
  db.insert('mentoring', { menteeId: students[1].id, mentorId: alumni[4].id, topic: 'Becoming a data analyst', message: 'Hello Divya, which projects and skills should I focus on to get a data analyst internship?', status: 'pending', response: '' });

  console.log('Demo data ready. Admin login: admin@alumni.com / admin123');
};

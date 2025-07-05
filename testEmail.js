const sendEmail = require('./utils/email');

sendEmail('sowmounass55@gmail.com', 'Test Email', 'Ceci est un test.')
  .then(() => console.log('✅ Email envoyé'))
  .catch((err) => console.error('❌ Erreur:', err));

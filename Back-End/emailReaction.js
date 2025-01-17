// emailReaction.js

require('dotenv').config();
const nodemailer = require('nodemailer');

/**
 * Fonction "Send Email" : 
 * @param {string} destinataire - adresse email
 * @param {string} subject - objet du mail
 * @param {string} text - contenu texte du mail
 */
async function sendEmail(destinataire, subject, text) {
  // Configurer le transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,     // ex: smtp.gmail.com
    port: process.env.SMTP_PORT,     // ex: 587
    secure: false,                   // ou true si port 465 (SSL)
    auth: {
      user: process.env.SMTP_USER,   // ex: tonemail@gmail.com
      pass: process.env.SMTP_PASS,   // mot de passe d'appli ou pass
    },
  });

  // Envoyer le mail
  const info = await transporter.sendMail({
    from: `"AREA Bot" <${process.env.SMTP_USER}>`,
    to: destinataire,
    subject,
    text,
  });

  console.log('[REACTION] Email envoyé avec succès, ID:', info.messageId);
}

// On exporte la fonction
module.exports = { sendEmail };

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
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Envoyer le mail
  const info = await transporter.sendMail({
    from: `"AREA Bot" <${process.env.SMTP_USER}>`,
    to: destinataire,
    subject,
    text,
  });
}

// On exporte la fonction
module.exports = { sendEmail };

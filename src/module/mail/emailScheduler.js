const cron = require('node-cron');
const nodemailer = require('nodemailer');
const RendezVousClient = require('../rendez-vous/RendezVousClient');

function contenuRappel(rendezVous) {
  const email_string = `
  <html>
    <head>
        <style>
        </style>
    </head>
    <body style="font-family: 'Arial', sans-serif; line-height: 1.6;">
        <h3 style="color: #333;">Rappel de votre rendez-vous chez notre salon de beauté</h3>
        <p>Bonjour `+ rendezVous.idClient.nom +`,</p>
          Un petit rappel : vous avez un rendez-vous demain chez notre salon de beauté pour votre séance de: `+ rendezVous.service.nom +`. Nous sommes impatients de vous voir !
          <p>À très bientôt !</p>
          <p>L'équipe de salon de beauté</p>
    </body>
  </html>`;
  return email_string;
}

const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "mihajaraman@gmail.com",
        pass: "yfrexltqylzgqtca",
      },
});

function rappelRendezVous(rendezVous) {
  envoyerEmail(rendezVous.idClient.email, 'Salon de beauté: Rappel de rendez-vous', contenuRappel(rendezVous));
}

// Fonction pour envoyer l'e-mail
function envoyerEmail(to, subject, contenu) {

    const mailOptions = {
        from: 'Salon de beaute', 
        to: to, 
        subject: subject,
        html: contenu
    };

    transporter.sendMail(mailOptions, (erreur, info) => {
        if (erreur) {
            console.error('Erreur lors de l\'envoi de l\'e-mail :', erreur);
        } else {
            console.log('E-mail envoyé avec succès :', info.response);
        }
    });
}

// async function test() {
//   const rd = await RendezVousClient.findById("65ddfc2f5bbf54084ef5fb6f").populate('idClient').populate('service');
//   console.log(rd);

//   const dateRappel = rd.dateTime; 
//   dateRappel.setDate(dateRappel.getDate() - 1);

//   const dayOfMonth = dateRappel.getDate();
//   const month = dateRappel.getMonth() + 1;
//   const dayOfWeek = dateRappel.getDay();

//   const cronPattern = `03 19 ${dayOfMonth} ${month} ${dayOfWeek}`;
//   console.log(cronPattern);

//   cron.schedule(cronPattern, () => { 
//       console.log('Planification de l\'envoi de l\'e-mail...');
//       rappelRendezVous(rd);
//   }, {
//       timezone: 'Africa/Nairobi' 
//   });
// }


async function planiferRappels() {
  try {
    const rendezVous = await RendezVousClient.find().populate('idClient').populate('service');

    rendezVous.forEach(rd => {
      const dateRappel = rd.dateTime; 
      dateRappel.setDate(dateRappel.getDate() - 1);

      const dayOfMonth = dateRappel.getDate();
      const month = dateRappel.getMonth() + 1;
      const dayOfWeek = dateRappel.getDay();

      const cronPattern = `00 10 ${dayOfMonth} ${month} ${dayOfWeek}`;

      cron.schedule(cronPattern, () => {
          console.log('Planification de l\'envoi du rappel pour :', rd.idClient.nom);
          rappelRendezVous(rd);
      }, {
          timezone: 'Africa/Nairobi' 
      });

    });
    
  } catch (error) {
     console.error('Erreur lors de la récupération des rendez-vous :', error);
  }
}

planiferRappels();
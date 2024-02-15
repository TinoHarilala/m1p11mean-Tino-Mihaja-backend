const Employe = require('../employe/EmployeModel');
const Preference = require('../preference/PreferenceModel');
const RendezVousEmploye = require('./RendezVousEmploye');

class RendezVousService {
    async getFreeEmploye(idService, dateTime) {
        try {
            const employes = await Employe.find({ 'services': idService, 'isDeleted': 0, 'isManager': 0 });
            
            const resultats = await Promise.all(employes.map(async (employe) => {
                const resultat = await RendezVousEmploye.find({ 'dateTime': dateTime, 'idEmploye': employe._id });
                if (resultat.length == 0) {
                    return employe;
                }
            }));

            if (resultats.length == 0) {
                throw new Error("Sorry, no employees will be available at this date and time");
            }

            return resultats;

        } catch (error) {
            throw error;
        }
    }

    async verificationPref(employe, dateTime) {
        try {
            

        } catch (error) {
            throw error;
        }
    }

    async priseRendezVous(rendezVousClient) {
        try {
            const services = rendezVousClient.services;
            services.forEach(service => {
                // const preference = await Preference.find({ 'service': service, 'isDeleted': 0 });
                // if (preference.length != 0) {
                    
                // }
            });

        } catch (error) {
            throw error;
        }
    }
}

module.exports = RendezVousService;
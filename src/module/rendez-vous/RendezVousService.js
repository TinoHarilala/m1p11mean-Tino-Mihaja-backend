const Employe = require('../employe/EmployeModel');
const Preference = require('../preference/PreferenceModel');
const RendezVousClient = require('./RendezVousClient');
const RendezVousEmploye = require('./RendezVousEmploye');

class RendezVousService {
    async getFreeEmploye(idService, dateTime) {
        try {
            const employes = await Employe.find({ 'services': idService, 'isDeleted': 0, 'isManager': 0 });
            let resultat = null;

            if (employes.length != 0) {
                for (const employe of employes) {
                    const free = await this.verificationFree(employe._id, dateTime);
                    if (free) {
                        resultat = employe;
                        break; 
                    }
                }   
            } else {
                throw new Error("Sorry, no employees will be available at this service");
            }
            
            if (resultat == null) {
                throw new Error("Sorry, no employees will be available at this date and time");
            }
            
            return resultat;

        } catch (error) {
            throw error;
        }
    }

    async verificationFree(idEmploye, dateTime) {
        try {
            const resultat = await RendezVousEmploye.find({ 
                'startTime': { $lte: dateTime }, // Vérifie si startTime est inférieur ou égal à dateTime
                'endTime': { $gte: dateTime },   // Vérifie si endTime est supérieur ou égal à dateTime
                'idEmploye': idEmploye 
            });

            if (resultat.length == 0) {
                return true;
            }

            return false;

        } catch (error) {
            throw error;
        }
    }

    async assignation(idEmploye, rendezVousClient) {
        try {
            const rdvc = await (await RendezVousClient.create(rendezVousClient)).populate('service');

            const duree = rdvc.service.duree;
            const startTime = new Date(rdvc.dateTime);
            const endTime = new Date(rdvc.dateTime);

            if (duree < 1) {
                endTime.setMinutes(endTime.getMinutes() + 30);
            } else {
                endTime.setHours(endTime.getHours() + duree);
            }

            const commission = (rdvc.service.prix * rdvc.service.commission) / 100;

            const rendezVousEmploye = {
                'idRendezVousClient': rdvc._id,
                'client': rdvc.idClient,
                'date': startTime,
                'startTime': startTime,
                'endTime':endTime,
                'service': rdvc.service._id,
                'idEmploye': idEmploye,
                'commission': commission
            }

            const rdve = await RendezVousEmploye.create(rendezVousEmploye);

        } catch (error) {
            throw error;
        }
    }

     async verificationClient(idClient, dateTime) {
        try {
            const resultat = await RendezVousEmploye.find({ 
                'startTime': { $lte: dateTime }, // Vérifie si startTime est inférieur ou égal à dateTime
                'endTime': { $gte: dateTime },   // Vérifie si endTime est supérieur ou égal à dateTime
                'client': idClient 
            });

            if (resultat.length == 0) {
                return true;
            }

            throw new Error("You already have an appointment on the date indicated");

        } catch (error) {
            throw error;
        }
    }

    async priseRendezVous(rendezVousClient) {
        try {
            const idService = rendezVousClient.service;
            const dateTime = rendezVousClient.dateTime;
            const preference = await Preference.find({ 'service': idService, 'idClient': rendezVousClient.idClient, 'isDeleted': 0 });

            const verify = await this.verificationClient(rendezVousClient.idClient, dateTime);

            if (verify) {
                if (preference.length != 0) {
                    const free = await this.verificationFree(preference[0].employe, dateTime);
                    if (free) {
                        this.assignation(preference[0].employe, rendezVousClient);

                    } else {
                        const freeEmp = await this.getFreeEmploye(idService, dateTime);
                        this.assignation(freeEmp, rendezVousClient);

                    }
                } else {
                    const freeEmp = await this.getFreeEmploye(idService, dateTime);
                    this.assignation(freeEmp, rendezVousClient);
                }
            }

        } catch (error) {
            throw error;
        }
    }
}

module.exports = RendezVousService;
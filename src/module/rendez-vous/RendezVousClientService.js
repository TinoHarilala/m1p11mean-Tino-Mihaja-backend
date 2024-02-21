const Employe = require('../employe/EmployeModel');
const Preference = require('../preference/PreferenceModel');
const Service = require('../service/ServiceModel');
const RendezVousClient = require('./RendezVousClient');
const RendezVousEmploye = require('./RendezVousEmploye');

class RendezVousService {
   
    async indisponibilite(idService) {
        try {
            const employes = await Employe.find({ 'services': idService, 'isDeleted': 0, 'isManager': 0 });
            const rendezVousEmploye = await RendezVousEmploye.find().sort({ 'date': 1 });
            const resultats = [];

            if (employes.length !== 0) {
                let debutIntersection = null;
                let finIntersection = null;
                let nbEmp = 0;
                const existEmp = [];
                console.log(rendezVousEmploye);
                for (let i = 0; i < rendezVousEmploye.length; i++) {

                    const rdve = rendezVousEmploye[i];
                    const debut2 = rdve.startTime;
                    const fin2 = rdve.endTime;

                    for (let j = 0; j < employes.length; j++) {
                        const employe = employes[j];

                        if (rdve.idEmploye.toString() === employe._id.toString()) {

                            if (debutIntersection === null && finIntersection === null) {
                                debutIntersection = debut2;
                                finIntersection = fin2;

                                existEmp.push(employe._id);
                                nbEmp++;

                            } else if (debutIntersection <= fin2 && finIntersection >= debut2) {
                                debutIntersection = debutIntersection > debut2 ? debutIntersection : debut2;
                                finIntersection = finIntersection < fin2 ? finIntersection : fin2;

                                existEmp.push(employe._id);
                                nbEmp++;

                            } else {
                                if ((debut2.getDate() == debutIntersection.getDate()) && (debut2.getMont()+1 == debutIntersection.getMont()+1) && (debut2.getFullYear() == debutIntersection.getFullYear())) {
                                    if (employe._id in existEmp) {
                                         if (nbEmp < employes.length) {
                                            debutIntersection = debut2;
                                            finIntersection = fin2;
                                             
                                            existEmp.splice(0, existEmp.length, employe._id);
                                            nbEmp = 1;
                                             
                                        } else {
                                            const resultat = {
                                                "startTime": debutIntersection,
                                                "endTime": finIntersection
                                            }
                                            resultats.push(resultat);
                                            debutIntersection = debut2;
                                            finIntersection = fin2;
                                            existEmp.splice(0, existEmp.length, employe._id);
                                            nbEmp = 1;
                                        }
                                    } else {
                                        debutIntersection = debut2;
                                        finIntersection = fin2;
                                        existEmp.splice(0, existEmp.length, employe._id);
                                        nbEmp = 1;
                                    }
                                } else {
                                    if (nbEmp < employes.length) {
                                        debutIntersection = debut2;
                                        finIntersection = fin2;
                                        existEmp.splice(0, existEmp.length, employe._id);
                                        nbEmp = 1;
                                    } else {
                                        const resultat = {
                                            "startTime": debutIntersection,
                                            "endTime": finIntersection
                                        }
                                        resultats.push(resultat);
                                        debutIntersection = debut2;
                                        finIntersection = fin2;
                                        existEmp.splice(0, existEmp.length, employe._id);
                                        nbEmp = 1;
                                    }
                                }
                                
                            }
                            // console.log(employe.nom);
                            // console.log("debut:");
                            // console.log(debutIntersection);
                            // console.log("fin:");
                            // console.log(finIntersection);  
                            // console.log("nb:");
                            // console.log(nbEmp);
                            // console.log("tableau:");
                            // console.log(existEmp);
                            // console.log("-----------------------------------------");
                            break; 
                        }
                    }
                }

                // Vérifier si nbEmp atteint le nombre d'employés du service
                if (nbEmp === employes.length) {
                    const resultat = {
                        "startTime": debutIntersection,
                        "endTime": finIntersection
                    }
                    resultats.push(resultat);
                }
                
            } else {
                throw new Error("Sorry, no employees will be available at this service");
            }

            return resultats;

        } catch (error) {
            console.log(error);
            throw error;
        }
    }


    async getFreeEmploye(idService, dateTime) {
        try {
            const employes = await Employe.find({ 'services': idService, 'isDeleted': 0, 'isManager': 0 });
            let resultat = null;

            if (employes.length != 0) {
                for (const employe of employes) {
                    const free = await this.verificationFree(employe._id, dateTime, idService);
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

    async verificationFree(idEmploye, dateTime, idService) {
        try {
            const service = await Service.findById({ _id: idService });
            const finService = new Date(dateTime);

            if (service.duree < 1) {
                finService.setMinutes(finService.getMinutes() + 30);
            } else {
                finService.setHours(finService.getHours() + service.duree);
            }

           const resultat = await RendezVousEmploye.find({
            $or: [
                {
                    startTime: { $lte: dateTime },
                    endTime: { $gte: dateTime }
                },
                {
                    startTime: { $lte: finService },
                    endTime: { $gte: finService }
                }
            ],
            idEmploye: idEmploye
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

     async verificationClient(idClient, dateTime, idService) {
         try {
            const service = await Service.findById({ _id: idService });
            const finService = new Date(dateTime);

            if (service.duree < 1) {
                finService.setMinutes(finService.getMinutes() + 30);
            } else {
                finService.setHours(finService.getHours() + service.duree);
            }
             
            const resultat = await RendezVousEmploye.find({ 
                $or: [
                    {
                        startTime: { $lte: dateTime },
                        endTime: { $gte: dateTime }
                    },
                    {
                        startTime: { $lte: finService },
                        endTime: { $gte: finService }
                    }
                ],
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

            const verify = await this.verificationClient(rendezVousClient.idClient, dateTime, idService);

            if (verify) {
                if (preference.length != 0) {
                    const free = await this.verificationFree(preference[0].employe, dateTime, idService);
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
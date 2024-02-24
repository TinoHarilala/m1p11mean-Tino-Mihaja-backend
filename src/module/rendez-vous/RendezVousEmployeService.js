const CommissionEmp = require('../commissionEmp/CommissionEmpModel');
const RendezVousEmploye = require('./RendezVousEmploye');
const { DateTime } = require('luxon');
const mongoose = require('mongoose');


class RendezVousService {
   
    async rendezVousEmp(idEmploye, date, service) {
        try {

            const filters = { 'idEmploye': idEmploye };

            if (service !== undefined) {
                if (service.toString() != "") {
                    filters.service = new mongoose.Types.ObjectId(service);
                }
            }

            if (date !== undefined) {
                if (date.toString() != "") {
                    const startOfDay = new Date(date);
                    startOfDay.setHours(0, 0, 0, 0); // Début de la journée
                    const endOfDay = new Date(date);
                    endOfDay.setHours(23, 59, 59, 999); // Fin de la journée

                    filters.date = { $gte: startOfDay, $lte: endOfDay };
                }
            }

            const rendezVous = await RendezVousEmploye.find(filters).populate('client').populate('service').sort({ 'date': -1 });
            
            return rendezVous;

        } catch (error) {
            throw error;
        }
    }

    async done(id) {
        try {
            const rendezVous = await RendezVousEmploye.findById({ _id: id });
            
            const today = DateTime.now().setZone('Europe/Moscow');
            const t = new Date(today.toString());

            if (rendezVous.endTime > t) {
                throw new Error("Le service n'est pas encore achevé");
            }

            rendezVous.done = 1;
            const update = await RendezVousEmploye.findByIdAndUpdate(rendezVous._id, rendezVous, { new: true });
          
            const ce = {
                "date": t,
                "employe": rendezVous.idEmploye,
                "montant": rendezVous.commission
            };

            const commisionEmp = await CommissionEmp.create(ce);
            
            return await this.rendezVousEmp(rendezVous.idEmploye);

        } catch (error) {
            throw error;
        }
    }
}

module.exports = RendezVousService;
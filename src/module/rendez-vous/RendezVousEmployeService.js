const CommissionEmp = require('../commissionEmp/CommissionEmpModel');
const RendezVousEmploye = require('./RendezVousEmploye');
const { DateTime } = require('luxon');

class RendezVousService {
   
    async rendezVousEmp(idEmploye) {
        try {
            const rendezVous = await RendezVousEmploye.find({ 'idEmploye': idEmploye }).populate('client').populate('service').sort({ 'date': -1 });
            
            return rendezVous;

        } catch (error) {
            throw error;
        }
    }

    async done(id) {
        try {
            const rendezVous = await RendezVousEmploye.findById({ _id: id });
            // const today = new Date();
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
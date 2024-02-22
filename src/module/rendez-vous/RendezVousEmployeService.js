const Employe = require('../employe/EmployeModel');
const Preference = require('../preference/PreferenceModel');
const Service = require('../service/ServiceModel');
const RendezVousClient = require('./RendezVousClient');
const RendezVousEmploye = require('./RendezVousEmploye');

class RendezVousService {
   
    async rendezVousEmp(idEmploye) {
        try {
            const rendezVous = await RendezVousEmploye.find({ 'idEmploye': idEmploye }).populate('client').populate('service').sort({ 'date': -1 });
            
            return rendezVous;

        } catch (error) {
            throw error;
        }
    }
}

module.exports = RendezVousService;
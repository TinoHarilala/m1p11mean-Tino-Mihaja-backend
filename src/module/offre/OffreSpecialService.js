const OffreSpecial = require('./OffreSpecialModel');

class OffreSpecialService {

    async getValide(date, idService) {
        try {
            const offreSpecials = await OffreSpecial.find({'isDeleted': 0, 'services': idService}).populate('services');
            const valide = [];

            for (const os of offreSpecials) {
                if (os.end >= date && os.start <= date) {
                    const v = await OffreSpecial.findByIdAndUpdate(os._id, os, { new: true });
                    valide.push(v);
                }
            }
            
            return valide;

        } catch (error) {
            throw error;
        }
    }
}

module.exports = OffreSpecialService;
const Employe = require("../employe/EmployeModel");
const StatistiqueService = require("./StatistiqueService");

const statistiqueService = new StatistiqueService();

class StatistiqueController {

    async tempsMoyenTravail(req, res) {
        try {
            const tempsMoyen = await statistiqueService.tempsMoyen(req.query.idEmploye, req.query.mois, req.query.annee);

            res.status(200).json({ tempsMoyen: tempsMoyen });
        } catch (error) {
            console.log(error);
            res.status(401).json({error: error.message});
        }
    }

}

module.exports = StatistiqueController;
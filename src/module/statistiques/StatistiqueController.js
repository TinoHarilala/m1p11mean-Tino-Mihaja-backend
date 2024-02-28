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

    
    async reservationParJourMois(req, res) {
        try {
            const reservationParJourMois = await statistiqueService.reservationParJourMois(req.query.mois, req.query.annee);

            res.status(200).json({ reservationParJourMois: reservationParJourMois });
        } catch (error) {
            console.log(error);
            res.status(401).json({error: error.message});
        }
    }

    async reservationParMois(req, res) {
        try {
            const reservationParJourMois = await statistiqueService.reservationParMois(req.query.annee);

            res.status(200).json({ reservationParJourMois: reservationParJourMois });
        } catch (error) {
            console.log(error);
            res.status(401).json({error: error.message});
        }
    }

    async chiffreAffaire(req, res) {
        try {
            const chiffreAffaire = await statistiqueService.chiffreAffaire(req.query.mois, req.query.annee);

            res.status(200).json({ chiffreAffaire: chiffreAffaire });
        } catch (error) {
            console.log(error);
            res.status(401).json({error: error.message});
        }
    }

    async chiffreAffaireParMois(req, res) {
        try {
            const chiffreAffaire = await statistiqueService.chiffreAffaireParMois(req.query.annee);

            res.status(200).json({ chiffreAffaire: chiffreAffaire });
        } catch (error) {
            console.log(error);
            res.status(401).json({error: error.message});
        }
    }

    async benefice(req, res) {
        try {
            const benefice = await statistiqueService.benefice(req.query.mois, req.query.annee);

            res.status(200).json({ benefice: benefice });
        } catch (error) {
            console.log(error);
            res.status(401).json({error: error.message});
        }
    }

}

module.exports = StatistiqueController;
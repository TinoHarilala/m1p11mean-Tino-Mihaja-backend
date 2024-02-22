const Paiement = require("./PaiementModel");
const PaiementService = require("./PaiementService");

const paiementService = new PaiementService();


class PaiementController {

    async getDetails(req, res) {
        try {

            const details = await Paiement.find({ 'idRendezVousClient': req.params.rendezVous, 'idClient': req.params.client }).sort({ 'date': 1 });

            res.status(200).json({ details: details });

        } catch (error) {
            res.status(401).json({error: error.message});
        }
    }

    async payer(req, res) {
        try {
            const paiement = new Paiement({ ...req.body });
            const payer = await paiementService.payer(paiement);

            const details = await Paiement.find({ 'idRendezVousClient': paiement.idRendezVousClient, 'idClient': paiement.idClient }).sort({ 'date': 1 });

            res.status(200).json({message: "Paiement validé", details: details });

        } catch (error) {
            res.status(401).json({error: error.message});
        }
    }
}

module.exports = PaiementController;
const OffreSpecial = require("../offre/OffreSpecialModel");
const Service = require("../service/ServiceModel");
const RendezVousClient = require("./RendezVousClient");
const RendezVousClientService = require("./RendezVousClientService");
const RendezVousEmployeService = require("./RendezVousEmployeService");

const rendezVousClientService = new RendezVousClientService();
const rendezVousEmployeService = new RendezVousEmployeService();


class RendezVousController {

    async priseRendezVous(req, res) {
        try {
            const rendezVousClient = new RendezVousClient({ ...req.body.rendezVous });
            const offre = await OffreSpecial.findById({ _id: req.body.offreSpecial }); 

            await rendezVousClientService.priseRendezVous(rendezVousClient, offre.remise);

            res.status(200).json({ message: "Successful appointments" });
            
        } catch (error) {
            res.status(401).json({ error: error.message });
        }
    }

    async indisponibilite(req, res) {
        try {
            const service = new Service({ ...req.body });
            const resultats = await rendezVousClientService.indisponibilite(service._id);

            res.status(200).json({ indisponibilite: resultats });
            
        } catch (error) {
            console.log(error);
            res.status(401).json({ error: error.message });
        }
    }

    async historique(req, res) {
        try {
            const resultats = await rendezVousClientService.historique(req.params.id);

            res.status(200).json({ historique: resultats });
            
        } catch (error) {
            console.log(error);
            res.status(401).json({ error: error.message });
        }
    }

    async rendezVousEmp(req, res) {
        try {
            const resultats = await rendezVousEmployeService.rendezVousEmp(req.params.id);

            res.status(200).json({ rendezVous: resultats });
            
        } catch (error) {
            console.log(error);
            res.status(401).json({ error: error.message });
        }
    }
}
module.exports = RendezVousController;
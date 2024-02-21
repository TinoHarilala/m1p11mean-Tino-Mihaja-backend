const Service = require("../service/ServiceModel");
const RendezVousClient = require("./RendezVousClient");
const RendezVousClientService = require("./RendezVousClientService");

const rendezVousClientService = new RendezVousClientService();


class RendezVousController {

    async priseRendezVous(req, res) {
        try {
            const rendezVousClient = new RendezVousClient({ ...req.body });
            await rendezVousClientService.priseRendezVous(rendezVousClient);

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
}
module.exports = RendezVousController;
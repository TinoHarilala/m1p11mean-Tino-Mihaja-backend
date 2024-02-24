const OffreSpecial = require("../offre/OffreSpecialModel");
const Service = require("../service/ServiceModel");
const RendezVousClient = require("./RendezVousClient");
const RendezVousClientService = require("./RendezVousClientService");
const RendezVousEmploye = require("./RendezVousEmploye");
const RendezVousEmployeService = require("./RendezVousEmployeService");
const SendMail = require('../mail/SendEmail');

const rendezVousClientService = new RendezVousClientService();
const rendezVousEmployeService = new RendezVousEmployeService();


class RendezVousController {

    async priseRendezVous(req, res) {
        try {
            const rendezVousClient = new RendezVousClient({ ...req.body.rendezVous });
            
            const offre = (req.body.offreSpecial) ? await OffreSpecial.findById({ _id: req.body.offreSpecial }) : null;
            await rendezVousClientService.priseRendezVous(rendezVousClient, (offre && offre.remise) ? offre.remise : null);

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
            const resultats = await rendezVousClientService.historique(req.params.idClient, req.query.date, req.query.service);
            // const mail = new SendMail();
            // await mail.sendEmailRappel("ramanamihandr@gmail.com");

            res.status(200).json({ historique: resultats });
            
        } catch (error) {
            console.log(error);
            res.status(401).json({ error: error.message });
        }
    }

    async rendezVousEmp(req, res) {
        try {
            const resultats = await rendezVousEmployeService.rendezVousEmp(req.params.idEmploye, req.query.date, req.query.service);
            

            res.status(200).json({ rendezVous: resultats });
            
        } catch (error) {
            console.log(error);
            res.status(401).json({ error: error.message });
        }
    }

    async done(req, res) {
        try {
            const resultats = await rendezVousEmployeService.done(req.params.id);

            res.status(200).json({ rendezVous: resultats });
            
        } catch (error) {
            console.log(error);
            res.status(401).json({ error: error.message });
        }
    }

    async suiviTacheEffectue(req, res) {
        try {
            const resultats = await RendezVousEmploye.find({'done': 1, 'idEmploye': req.params.idEmploye}).populate('service').populate('client');

            res.status(200).json({ rendezVous: resultats });
            
        } catch (error) {
            console.log(error);
            res.status(401).json({ error: error.message });
        }
    }
}
module.exports = RendezVousController;
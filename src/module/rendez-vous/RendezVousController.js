const RendezVousClient = require("./RendezVousClient");
const RendezVousService = require("./RendezVousService");

const rendezVousService = new RendezVousService();


class RendezVousController {

    async priseRendezVous(req, res) {
        try {
            const rendezVousClient = new RendezVousClient({ ...req.body });
            rendezVousService.priseRendezVous(rendezVousClient);

            res.status(200).json({ message: "Successful appointments" });
            
        } catch (error) {
            console.log(error);
            res.status(401).json({ error: error });
        }
    }
}
module.exports = RendezVousController;
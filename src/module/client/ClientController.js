const Client = require('./ClientModel');
const ClientService = require('./ClientService');
const { secret_code, Middleware } = require('../../middleware/index');

const clientService = new ClientService();
const middleware = new Middleware();

class ClientController {
    
    async login(req, res) {
        try {
            const clientLog = new Client({ ...req.body });
            const client = await clientService.authentification(clientLog);
            const token = middleware.createToken(client);
            res.status(200).json({ token: token, client: client});
        } catch (error) {
            res.status(401).json({ error: error.message });
        }
    }

    async registrate(req, res) {
        try {
            const clientReg = new Client({ ...req.body });
            const client = await clientService.registration(clientReg);

            res.status(200).json({ message: "Registration succes", client: client });
        } catch (error) {
            res.status(401).json({ error: error.message });
        }
    }
}

module.exports = ClientController;
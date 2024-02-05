const Client = require('./ClientModel');
const bcrypt = require('bcrypt');

class ClientService {
    async authentification(client) {
        try {
            const clientLog = await Client.findOne({
                email: client.email
            });

            if (!clientLog || !(await bcrypt.compare(client.password, clientLog.password))) {
                throw new Error('Identifiants invalides');
            }

            return clientLog;

        } catch (error) {
            throw error;
        }
    }

    async registration(client) {
        try {
            if (client.password) {
                // Hacher le mot de passe
                client.password = await bcrypt.hash(client.password, 10);

                const cl = await Client.create(client);
                return cl;
            } else {
                throw new Error("Le mot de passe est indéfini ou nul");
            }
             
        } catch (error) {
            console.log(error);
            throw new Error("L'inscription a échoué dans le service");
        }
    }
}

module.exports = ClientService;
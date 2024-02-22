const Paiement = require('./PaiementModel');
const RendezVousClient = require('../rendez-vous/RendezVousClient');
const Client = require('../client/ClientModel');
const CompteSociete = require('../compteSociete/CompteSocieteModel');

class PaiementService {

    async payer(paiement) {
        try {
            if (!paiement.date) {
                paiement.date = Date.now;
            }

            const details = await Paiement.find({ 'idRendezVousClient': paiement.idRendezVousClient }).sort({'date': -1}).limit(1);

            const client = await Client.findById({ _id: paiement.idClient });

            if (client.solde < paiement.montant) {
                throw new Error("Votre solde est insuffisant");
            }

            const rdve = await RendezVousClient.findById({ _id: paiement.idRendezVousClient });

            if (details.length === 0) {
                paiement.aPayer = rdve.prix;                
            } else {
                if (details[0].reste === 0) {
                    throw new Error("Le montant restant à payer est de 0");
                }

                paiement.aPayer = details[0].reste;
            }

            if (paiement.montant > paiement.aPayer) {
                throw new Error("Le montant indiqué doit être inférieur au reste à payer");
            }

            const reste = paiement.aPayer - paiement.montant;
            paiement.reste = reste;
            const p = await Paiement.create(paiement);

            const cs = {
                "date": paiement.date,
                "montant": paiement.montant
            };

            const compteSociete = await CompteSociete.create(cs);
            client.solde = client.solde - paiement.montant;
            const updateClient = await Client.findByIdAndUpdate(client._id, client, { new: true });

            if (reste === 0) {
                rdve.paymentStatus = 10;
                const update = await RendezVousClient.findByIdAndUpdate(rdve._id, rdve, { new: true });
            }

        } catch (error) {
            throw error;
        }
    }
}

module.exports = PaiementService;
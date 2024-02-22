const { ObjectId, Schema, Types, model } = require("mongoose");

const PaiementSchema = new Schema({
    idClient: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
    idRendezVousClient: { type: Schema.Types.ObjectId, ref: 'RendezVousClient', required: true },
    montant: { type: Number, required: true },
    date: { type: Date, default: Date.now, required: true },
    aPayer: { type: Number, required: true },
    reste: {type: Number, required: true}
});

const Paiement = model("Paiement", PaiementSchema);

module.exports = Paiement;
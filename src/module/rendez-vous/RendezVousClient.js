const { ObjectId, Schema, Types, model } = require("mongoose");
const { Service } = require("../service/ServiceModel");

const RendezVousClientSchema = new Schema({
    idClient: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
    dateTime: { type: Date, required: true }, 
    service: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
    employe: { type: Schema.Types.ObjectId, ref: 'Employe', required: true },
    prix: { type: Number, required: true, default: 0 },
    paymentStatus: { type: Number, required: true, default: 0 }
});

const RendezVousClient = model("RendezVousClient", RendezVousClientSchema);

module.exports = RendezVousClient;
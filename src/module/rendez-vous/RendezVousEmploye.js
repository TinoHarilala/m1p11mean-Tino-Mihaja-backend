const { ObjectId, Schema, Types, model } = require("mongoose");

const RendezVousEmployeSchema = new Schema({
    idRendezVousClient: { type: Schema.Types.ObjectId, ref: 'RendezVousClient', required: true },
    client: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
    date: { type: Date, required: true }, 
    startTime: { type: Date, required: true }, 
    endTime: { type: Date, required: true }, 
    service: { type: Schema.Types.ObjectId, ref:'Service', required: true },
    idEmploye: { type: Schema.Types.ObjectId, ref:'Employe', required: true },
    done: {type: Number, required: true, default: 0},
    commission: {type: Number, required: true, default: 0}
});

const RendezVousEmploye = model("RendezVousEmploye", RendezVousEmployeSchema);

module.exports = RendezVousEmploye;
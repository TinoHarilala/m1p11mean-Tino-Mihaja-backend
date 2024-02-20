const { ObjectId, Schema, Types, model } = require("mongoose");
const { Service } = require("../service/ServiceModel");

const EmployeSchema = new Schema({
    nom: { type: String, required: true },
    dateNaissance: { type: Date, required: true },
    contact: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    adresse: { type: String, required: true }, 
    services: [{ type: Schema.Types.ObjectId, ref:'Service', required: false }],
    isManager: { type: Number, required: true, default: 0 },
    image: { type: String, required: false },
    isDeleted: {type: Number, required: true, default: 0}
});

const Employe = model("Employe", EmployeSchema);

module.exports = Employe;
const { ObjectId, Schema, Types, model } = require("mongoose");

const ManagerSchema = new Schema({
    nom: { type: String, required: true },
    dateNaissance: { type: Date, required: true },
    contact: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    solde: { type: Number, required: false, default: 0 }
});

const Manager = model("Manager", ManagerSchema);

module.exports = Manager;
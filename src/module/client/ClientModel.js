const { ObjectId, Schema, Types, model } = require("mongoose");

const ClientSchema = new Schema({
    nom: { type: String, required: true },
    dateNaissance: { type: Date, required: true },
    contact: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String, required: false },
    solde: { type: Number, required: false, default: 0 }
});

const Client = model("Client", ClientSchema);

module.exports = Client;
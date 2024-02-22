const { ObjectId, Schema, Types, model } = require("mongoose");

const CompteSocieteSchema = new Schema({
    date: { type: Date, required: true },
    montant: { type: Number, required: true }
});

const CompteSociete = model("CompteSociete", CompteSocieteSchema);

module.exports = CompteSociete;
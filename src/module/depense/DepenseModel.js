const { ObjectId, Schema, Types, model } = require("mongoose");

const DepenseSchema = new Schema({
    description: { type: String, required: true },
    montant: { type: Number, required: true },
    date: { type: Date, required: true, default: Date.now },
    isDeleted: {type: Number, required: true, default: 0}
});

const Depense = model("Depense", DepenseSchema);

module.exports = Depense;
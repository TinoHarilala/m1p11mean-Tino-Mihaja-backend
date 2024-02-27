const { ObjectId, Schema, Types, model } = require("mongoose");

const OffreSpecialSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: false },
    services: [{ type: Schema.Types.ObjectId, ref: 'Service', required: true }],
    remise: { type: Number, required: true },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    isDeleted: { type: Number, required: true, default: 0 }
});

const OffreSpecial = model("OffreSpecial", OffreSpecialSchema);

module.exports = OffreSpecial;
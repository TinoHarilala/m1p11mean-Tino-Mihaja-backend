const { ObjectId, Schema, Types, model } = require("mongoose");

const ServiceSchema = new Schema({
    nom: { type: String, required: true },
    prix: { type: Number, required: true },
    duree: { type: Number, required: true },
    commission: { type: Number, required: true},
    description: { type: String, required: false },
    image: { type: String, required: false },
    isDeleted: {type: Number, required: true, default: 0}
});

const Service = model("Service", ServiceSchema);

module.exports = Service;
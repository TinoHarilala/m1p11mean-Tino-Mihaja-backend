const { ObjectId, Schema, Types, model } = require("mongoose");

const PreferenceSchema = new Schema({
    idClient: { type: Schema.Types.ObjectId, ref:'Client', required: true },
    employe: { type: Schema.Types.ObjectId, ref:'Employe', required: true },
    service: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
    isDeleted: {type: Number, required: true, default: 0}
});

const Preference = model("Preference", PreferenceSchema);

module.exports = Preference;
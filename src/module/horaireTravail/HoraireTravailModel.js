const { ObjectId, Schema, Types, model } = require("mongoose");

const HoraireTravailSchema = new Schema({
    employe: { type: Schema.Types.ObjectId, ref:'Employe', required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true }
});

const HoraireTravail = model("HoraireTravail", HoraireTravailSchema);

module.exports = HoraireTravail;
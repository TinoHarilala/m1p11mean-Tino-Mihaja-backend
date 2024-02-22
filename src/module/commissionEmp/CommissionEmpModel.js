const { ObjectId, Schema, Types, model } = require("mongoose");

const CommissionEmpSchema = new Schema({
    date: { type: Date, required: true },
    employe: { type: Schema.Types.ObjectId, ref:'Employe', required: true },
    montant: { type: Number, required: true }
});

const CommissionEmp = model("CommissionEmp", CommissionEmpSchema);

module.exports = CommissionEmp;
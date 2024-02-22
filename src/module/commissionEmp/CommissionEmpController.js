const CommissionEmp = require("./CommissionEmpModel");
const mongoose = require('mongoose');

class CommissionEmpController {

    async get(req, res) {
        try {

            const emp = new mongoose.Types.ObjectId(req.params.employe);

            const resultats = await CommissionEmp.aggregate([
                {
                    $group: {
                        _id: {
                            date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                            employe: "$employe"
                        },
                        total: { $sum: "$montant" }
                    }
                },
                {
                    $match: { "_id.employe": emp }
                },
                {
                    $project: {
                        date: "$_id.date",
                        employe: "$_id.employe",
                        total: 1,
                        _id: 0 
                    }
                },
                { $sort: { '_id.date': -1 } }
            ]);

            res.status(200).json({ commissions: resultats });

        } catch (error) {
            console.log(error);
            res.status(401).json({error: error.message});
        }
    }

}

module.exports = CommissionEmpController;
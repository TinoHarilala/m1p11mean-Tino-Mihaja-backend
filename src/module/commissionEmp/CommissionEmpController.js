const CommissionEmp = require("./CommissionEmpModel");
const mongoose = require('mongoose');

class CommissionEmpController {

    async get(req, res) {
    try {
        const emp = new mongoose.Types.ObjectId(req.params.employe);

        const pipeline = [
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
            {
                $addFields: {
                    year: { $year: { $toDate: "$date" } }, // Ajouter l'année de la date
                    month: { $month: { $toDate: "$date" } } // Ajouter le mois de la date
                }
            },
        ];

        // Construire le filtre pour les mois et/ou années définis
        const filter = {};
        if (req.query.mois !== undefined) {
            if (req.query.mois.toString() != "") {
                filter.month = parseInt(req.query.mois);
            }
        }
        if (req.query.annee !== undefined) {
            if (req.query.annee.toString() != "") {
                filter.year = parseInt(req.query.annee);
            }
        }

        // Ajouter le filtre au pipeline s'il y a des filtres définis
        if (Object.keys(filter).length > 0) {
            pipeline.push({ $match: filter });
        }

        pipeline.push({ $sort: { 'date': -1 } });

        const resultats = await CommissionEmp.aggregate(pipeline);

        res.status(200).json({ commissions: resultats });
    } catch (error) {
        console.log(error);
        res.status(401).json({error: error.message});
    }
}


}

module.exports = CommissionEmpController;
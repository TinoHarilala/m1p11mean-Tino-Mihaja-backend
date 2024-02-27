const RendezVousEmploye = require('../rendez-vous/RendezVousEmploye');
const mongoose = require('mongoose');
const RendezVousClient = require('../rendez-vous/RendezVousClient');
const CompteSociete = require('../compteSociete/CompteSocieteModel');
const Depense = require('../depense/DepenseModel');


class StatistiqueService {

    async tempsMoyen(employe, mois, annee) {
        const int = parseInt(1);
        const emp = new mongoose.Types.ObjectId(employe);
        
        const pipeline = [
            {
                $match: { 'done': 1 }
            },
            {
                $group: {
                    _id: {
                        date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                        employe: "$idEmploye"
                    },
                    totalMilliseconds: {
                        $sum: { $subtract: ["$endTime", "$startTime"] }
                    }
                }
            },
            {
                $project: {
                    date: "$_id.date",
                    employe: "$_id.employe",
                    totalHours: { $divide: ["$totalMilliseconds", 3600000] },
                    _id: 0
                }
            },
            {
                $group: {
                    _id: {
                        employe: "$employe",
                        year_month: { $substr: ["$date", 0, 7] } // Extraire l'année et le mois de la date
                    },
                    totalHours: { $sum: "$totalHours" },
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    employe: "$_id.employe",
                    year_month: "$_id.year_month",
                    month: { $toInt: { $substr: ["$_id.year_month", 5, 2] } }, 
                    year: { $toInt: { $substr: ["$_id.year_month", 0, 4] } },
                    totalHours: 1,
                    count: 1,
                    averageHours: { $divide: ["$totalHours", 22] },
                    _id: 0
                }
            },
            {
                $lookup: {
                    from: "employes",
                    localField: "employe",
                    foreignField: "_id",
                    as: "employee"
                }
            },
            {
                $addFields: {
                    employee: { $arrayElemAt: ["$employee", 0] }
                }
            }
        ];

        const filter = {};
        if (mois !== undefined) {
            if (mois.toString() != "") {
                filter.month = parseInt(mois);
            }
        }
        if (annee !== undefined) {
            if (annee.toString() != "") {
                filter.year = parseInt(annee);
            }
        }

        if (Object.keys(filter).length > 0) {
            pipeline.push({ $match: filter });
        }

        pipeline.push({ $sort: { 'date': -1 } });

        const resultats = await RendezVousEmploye.aggregate(pipeline);


        return resultats;
    }


    async reservationParJourMois( mois, annee) {
        
        const pipeline = [
            {
                $group: {
                    _id: {
                        date: { $dateToString: { format: "%Y-%m-%d", date: "$dateTime" } }
                    },
                    count: { $sum: 1 } 
                }
            },
            {
                $project: {
                    _id: 0,
                    date: "$_id.date",
                    count: 1
                }
            },
            {
                $addFields: {
                    year: { $year: { $toDate: "$date" } },
                    month: { $month: { $toDate: "$date" } } 
                }
            }
        ];

        const filter = {};
        if (mois !== undefined) {
            if (mois.toString() != "") {
                filter.month = parseInt(mois);
            }
        }
        if (annee !== undefined) {
            if (annee.toString() != "") {
                filter.year = parseInt(annee);
            }
        }

        if (Object.keys(filter).length > 0) {
            pipeline.push({ $match: filter });
        }

        pipeline.push({ $sort: { 'date': 1 } });

        const resultats = await RendezVousClient.aggregate(pipeline);

        return resultats;
    }

    async chiffreAffaire( mois, annee) {
        
        const pipeline = [
            {
                $group: {
                    _id: {
                        date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } }
                    },
                    total: { $sum: "$montant" }
                }
            },
            {
                $project: {
                    _id: 0,
                    date: "$_id.date",
                    total: 1
                }
            },
            {
                $addFields: {
                    year: { $year: { $toDate: "$date" } },
                    month: { $month: { $toDate: "$date" } } 
                }
            }
        ];

        const filter = {};
        if (mois !== undefined) {
            if (mois.toString() != "") {
                filter.month = parseInt(mois);
            }
        }
        if (annee !== undefined) {
            if (annee.toString() != "") {
                filter.year = parseInt(annee);
            }
        }

        if (Object.keys(filter).length > 0) {
            pipeline.push({ $match: filter });
        }

        pipeline.push({ $sort: { 'date': 1 } });

        const resultats = await CompteSociete.aggregate(pipeline);

        return resultats;
    }

    async benefice(mois, annee) {
        
        const revenu = await CompteSociete.aggregate([
            {
                $group: {
                    _id: {
                        date: { $dateToString: { format: "%Y-%m", date: "$date" } }
                    },
                    total: { $sum: "$montant" }
                }
            },
            {
                $project: {
                    _id: 0,
                    date: "$_id.date",
                    total: 1
                }
            },
            {
                $addFields: {
                    year: { $year: { $toDate: "$date" } },
                    month: { $month: { $toDate: "$date" } } 
                }
            }
        ]);

        const depenses = await Depense.aggregate([
            {
                $group: {
                    _id: {
                        date: { $dateToString: { format: "%Y-%m", date: "$date" } }
                    },
                    total: { $sum: "$montant" }
                }
            },
            {
                $project: {
                    _id: 0,
                    date: "$_id.date",
                    total: 1
                }
            },
            {
                $addFields: {
                    year: { $year: { $toDate: "$date" } },
                    month: { $month: { $toDate: "$date" } } 
                }
            }
        ]);

        let beneficeParMois = {};

        revenu.forEach(rev => {
            const key = rev.year + '-' + rev.month;
                if (!beneficeParMois[key]) {
                    beneficeParMois[key] = { revenu: 0, depenses: 0 };
                }
                beneficeParMois[key].revenu += rev.total;
        });

        depenses.forEach(dep => {
            const key = dep.year + '-' + dep.month;
                if (!beneficeParMois[key]) {
                    beneficeParMois[key] = { revenu: 0, depenses: 0 };
                }
                beneficeParMois[key].depenses += dep.total;
        });

        const resultats = [];

        Object.keys(beneficeParMois).forEach(key => {
            beneficeParMois[key].benefice = beneficeParMois[key].revenu - beneficeParMois[key].depenses;

            const s = key.split("-");
            const a = s[0];
            const m = s[1];

            beneficeParMois[key].date = key;

            if (mois !== undefined && annee !== undefined) {
                if (mois.toString() != "" && annee.toString() != "") {
                    if (annee + '-' + mois == key) {
                        resultats.push(beneficeParMois[key]); 
                    }
                }
            }

            if (mois === undefined) {
                if (annee == a) {
                    resultats.push(beneficeParMois[key]); 
                }
            }

            if (annee === undefined) {
                if (mois == m) {
                    resultats.push(beneficeParMois[key]); 
                }
            }
            
            if (mois == undefined && annee == undefined){
                resultats.push(beneficeParMois[key]); 
            }
        });

        return resultats;
    }
}

module.exports = StatistiqueService;
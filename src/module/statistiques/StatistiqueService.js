const RendezVousEmploye = require('../rendez-vous/RendezVousEmploye');
const mongoose = require('mongoose');


class StatistiqueService {

    async tempsMoyen(employe, mois, annee) {
        const int = parseInt(1);
        const emp = new mongoose.Types.ObjectId(employe);
        
        const pipeline = [
            {
                $group: {
                    _id: {
                        date: { $dateToString: { format: "%Y-%m", date: "$date" } },
                        employe: "$employe"
                    },
                    totalHours: {
                        $sum: {
                            $subtract: ["$endTime", "$startTime"]
                        }
                    }
                }
            },
            {
                $match: { "_id.employe": emp }
            },
            {
                $project: {
                    date: "$_id.date",
                    employe: "$_id.employe",
                    totalHours: 1,
                    _id: 0
                }
            },
            {
                $addFields: {
                    year: { $year: { $toDate: "$date" } }, // Ajouter l'année de la date
                    month: { $month: { $toDate: "$date" } } // Ajouter le mois de la date
                }
            }
        ];

        // Construire le filtre pour les mois et/ou années définis
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

        // Ajouter le filtre au pipeline s'il y a des filtres définis
        if (Object.keys(filter).length > 0) {
            pipeline.push({ $match: filter });
        }

        pipeline.push({ $sort: { 'date': -1 } });

        // const resultats = await RendezVousEmploye.aggregate([
        //     {
        //         $group: {
        //             _id: {
        //                 date: { $dateToString: { format: "%Y-%m", date: "$date" } },
        //                 employe: "$idEmploye"
        //             },
        //             totalHours: {
        //                 $sum: {
        //                     $divide: [{ $subtract: ["$endTime", "$startTime"] }, 3600000] 
        //                 }
        //             }
        //         }
        //     },
        //     {
        //         $project: {
        //             date: "$_id.date",
        //             employe: "$_id.employe",
        //             totalHours: 1,
        //             _id: 0
        //         }
        //     },
        //     {
        //         $addFields: {
        //             year: { $year: { $toDate: "$date" } }, // Ajouter l'année de la date
        //             month: { $month: { $toDate: "$date" } } // Ajouter le mois de la date
        //         }
        //     }
        // ]);
const resultats = await RendezVousEmploye.aggregate([
    {
        $group: {
            _id: {
                date: { $dateToString: { format: "%Y-%m", date: "$date" } },
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
            totalHours: { $divide: ["$totalMilliseconds", 3600000] }, // Convertir les millisecondes en heures
            _id: 0
        }
    },
    {
        $group: {
            _id: "$employe",
            totalHours: { $sum: "$totalHours" }, // Somme des heures de travail pour chaque employé
            count: { $sum: 1 } // Compter le nombre d'enregistrements pour chaque employé (pour obtenir le nombre de mois)
        }
    },
    {
        $project: {
            employe: "$_id",
            totalHours: 1,
            averageHours: { $divide: ["$totalHours", { $multiply: ["$count", 176] }] }, // Division par le nombre total d'heures dans tous les mois
            _id: 0
        }
    }
]);



        return resultats;
    }
}

module.exports = StatistiqueService;
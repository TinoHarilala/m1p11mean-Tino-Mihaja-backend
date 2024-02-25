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

        Object.keys(beneficeParMois).forEach(key => {
            beneficeParMois[key].benefice = beneficeParMois[key].revenu - beneficeParMois[key].depenses;
        });

        return beneficeParMois;
    }
}

module.exports = StatistiqueService;
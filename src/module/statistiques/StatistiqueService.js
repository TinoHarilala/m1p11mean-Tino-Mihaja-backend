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
    const resultatsBruts = await RendezVousEmploye.aggregate([
    {
        $project: {
            date: 1,
            idEmploye: 1,
            heureTravail: {
                    $divide: [{ $subtract: ["$endTime", "$startTime"] }, 3600000]
            },
            _id: 0
        }
    }
]);

// Maintenant, vous pouvez peupler les références
const resultats = await RendezVousEmploye.populate(resultatsBruts, { path: "idEmploye" });

// resultatsPeuples contiendra les résultats peuplés


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
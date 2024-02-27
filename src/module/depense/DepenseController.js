const Depense = require("./DepenseModel");

class DepenseController {

    async create(req, res) {
        try {
            const depense = new Depense({ ...req.body });

            const d = await Depense.create(depense);

            const int = parseInt(0);

            const pipeline1 = [
                {
                    $match: { "isDeleted": int } // Assurez-vous que "isDeleted" est un booléen
                },
                {
                    $project: {
                        description: 1,
                        date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } }, // Utilisez $dateToString pour formater la date
                        montant: 1,
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

            const pipeline2 = [
                {
                    $match: { "isDeleted": int }
                },
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
                        date: "$_id.date",
                        total: 1,
                        _id: 1 
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
                filter.month = parseInt(req.query.mois);
            }
            if (req.query.annee !== undefined) {
                filter.year = parseInt(req.query.annee);
            }

            // Ajouter le filtre au pipeline s'il y a des filtres définis
            if (Object.keys(filter).length > 0) {
                pipeline1.push({ $match: filter });
                pipeline2.push({ $match: filter });
            }

            pipeline1.push({ $sort: { 'date': -1 } });

            const depenses = await Depense.aggregate(pipeline1);
            const total = await Depense.aggregate(pipeline2);
            

            res.status(200).json({ Depense: depenses, Total: total });
        } catch (error) {
            console.log(error);
            res.status(401).json({error: error.message});
        }
    }

    async get(req, res) {
        try {
             const int = parseInt(0);

            const pipeline1 = [
                {
                    $match: { "isDeleted": int } // Assurez-vous que "isDeleted" est un booléen
                },
                {
                    $project: {
                        description: 1,
                        date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } }, // Utilisez $dateToString pour formater la date
                        montant: 1,
                        _id: 1
                    }
                },
                {
                    $addFields: {
                        year: { $year: { $toDate: "$date" } }, // Ajouter l'année de la date
                        month: { $month: { $toDate: "$date" } } // Ajouter le mois de la date
                    }
                }
            ];

            const pipeline2 = [
                {
                    $match: { "isDeleted": int }
                },
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
                        date: "$_id.date",
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
                filter.month = parseInt(req.query.mois);
            }
            if (req.query.annee !== undefined) {
                filter.year = parseInt(req.query.annee);
            }

            // Ajouter le filtre au pipeline s'il y a des filtres définis
            if (Object.keys(filter).length > 0) {
                pipeline1.push({ $match: filter });
                pipeline2.push({ $match: filter });
            }

            pipeline1.push({ $sort: { 'date': -1 } });

            const depenses = await Depense.aggregate(pipeline1);
            const total = await Depense.aggregate(pipeline2);
            
            res.status(200).json({ Depense: depenses, Total: total });
        } catch (error) {
            console.log(error);
            res.status(401).json({ error: error.message });
        }
    }

    async findById(req, res) {
        try {
            const depense = await Depense.findById({_id: req.params.id});

            res.status(200).json({ Depense: depense });
        } catch (error) {
            console.log(error);
            res.status(401).json({error: error.message});
        }
    }

    async update(req, res) {
        try {
            const depense = new Depense({ ...req.body });
            const d = await Depense.findByIdAndUpdate(depense._id, depense, { new: true });

            res.status(200).json({ Depense: d });
        } catch (error) {
            console.log(error);
            res.status(401).json({error: error.message});
        }
    }

    async delete(req, res) {
        try {
            const d = await Depense.findById({ _id: req.params.id });
            d.isDeleted = 1;
            const depense = await Depense.findByIdAndUpdate(d._id, d, { new: true });
            const depenses = await Depense.find({'isDeleted': 0});

            res.status(200).json({ message: "Successful deletion", "Depense": depenses });
        } catch (error) {
            console.log(error);
            res.status(401).json({ error: error.message });
        }
    }
}

module.exports = DepenseController;
const Depense = require("./DepenseModel");

class DepenseController {

    async create(req, res) {
        try {
            const depense = new Depense({ ...req.body });

            const d = await Depense.create(depense);
            const depenses = await Depense.find({'isDeleted': 0});

            res.status(200).json({ Depense: depenses });
        } catch (error) {
            console.log(error);
            res.status(401).json({error: error.message});
        }
    }

    async get(req, res) {
        try {
            const depenses = await Depense.find({'isDeleted': 0});

            res.status(200).json({ Depense: depenses });
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
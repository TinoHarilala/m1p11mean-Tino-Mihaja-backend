const Preference = require("./PreferenceModel");


class PreferenceController {

    async create(req, res) {
        try {
            const preference = new Preference({ ...req.body });
            const pref = await Preference.create(preference);
            const preferences = await Preference.find({'isDeleted': 0});

            res.status(200).json({ Preference: preferences });
        } catch (error) {
            console.log(error);
            res.status(401).json({error: error.message});
        }
    }

    async get(req, res) {
        try {
            const preferences = await Preference.find({'isDeleted': 0}).populate('employe').populate('service');

            res.status(200).json({ Preference: preferences });
        } catch (error) {
            console.log(error);
            res.status(401).json({ error: error.message });
        }
    }

    async findById(req, res) {
        try {
            const preference = await Preference.findById({_id: req.params.id}).populate('employe').populate('service');

            res.status(200).json({ Preference: preference });
        } catch (error) {
            console.log(error);
            res.status(401).json({error: error.message});
        }
    }

    async update(req, res) {
        try {
            const preference = new Preference({ ...req.body });
            const pref = await Preference.findByIdAndUpdate(preference._id, preference, { new: true });

            res.status(200).json({ Preference: pref });
        } catch (error) {
            console.log(error);
            res.status(401).json({error: error.message});
        }
    }

    async delete(req, res) {
        try {
            const pref = await Preference.findById({ _id: req.params.id });
            pref.isDeleted = 1;
            const preference = await Preference.findByIdAndUpdate(pref._id, pref, { new: true });

            res.status(200).json({ message: "Successful deletion" });
        } catch (error) {
            console.log(error);
            res.status(401).json({ error: error.message });
        }
    }
}

module.exports = PreferenceController;
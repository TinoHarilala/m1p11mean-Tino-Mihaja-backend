const Client = require("../client/ClientModel");
const Notification = require("../notification/NotificationModel");
const Service = require("../service/ServiceModel");
const OffreSpecial = require("./OffreSpecialModel");
const OffreSpecialService = require("./OffreSpecialService");

const offreSpecialService = new OffreSpecialService();


class OffreSpecialController {

    async create(req, res) {
        try {
            const offreSpecial = new OffreSpecial({ ...req.body });

            if (offreSpecial.services.length === 0) {
                const services = await Service.find({ 'isDeleted': 0 });
                offreSpecial.services = services;
            }
            
            const o = await OffreSpecial.create(offreSpecial);
            const clients = await Client.find();
            for (const client of clients) {
                const notif = await Notification.create({ "client": client, "offre": o });
            }
            const offreSpecials = await OffreSpecial.find({'isDeleted': 0}).populate('services');

            res.status(200).json({ OffreSpecial: offreSpecials });
        } catch (error) {
            console.log(error);
            res.status(401).json({error: error.message});
        }
    }

    async get(req, res) {
        try {
            const offreSpecials = await OffreSpecial.find({'isDeleted': 0}).populate('services');

            res.status(200).json({ OffreSpecial: offreSpecials });
        } catch (error) {
            console.log(error);
            res.status(401).json({ error: error.message });
        }
    }

    async getValide(req, res) {
        try {
            const date = new Date(req.params.date);
            const offreSpecials = await offreSpecialService.getValide(date, req.params.idService);

            res.status(200).json({ OffreSpecial: offreSpecials });
        } catch (error) {
            console.log(error);
            res.status(401).json({ error: error.message });
        }
    }

    async findById(req, res) {
        try {
            const offreSpecial = await OffreSpecial.findById({_id: req.params.id}).populate('services');

            res.status(200).json({ OffreSpecial: offreSpecial });
        } catch (error) {
            console.log(error);
            res.status(401).json({error: error.message});
        }
    }

    async update(req, res) {
        try {
            const offreSpecial = new OffreSpecial({ ...req.body });
            const o = await OffreSpecial.findByIdAndUpdate(offreSpecial._id, offreSpecial, { new: true }).populate('services');

            res.status(200).json({ OffreSpecial: o });
        } catch (error) {
            console.log(error);
            res.status(401).json({error: error.message});
        }
    }

    async delete(req, res) {
        try {
            const offre = await OffreSpecial.findById({ _id: req.params.id });
            offre.isDeleted = 1;
            const offreSpecial = await OffreSpecial.findByIdAndUpdate(offre._id, offre, { new: true });
            const offreSpecials = await OffreSpecial.find({'isDeleted': 0}).populate('services');

            res.status(200).json({ message: "Successful deletion", "OffreSpecial": offreSpecials });
        } catch (error) {
            console.log(error);
            res.status(401).json({ error: error.message });
        }
    }
}

module.exports = OffreSpecialController;
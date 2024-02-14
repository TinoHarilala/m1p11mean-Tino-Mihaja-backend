const Service = require("./ServiceModel");


class ServiceController {

    async create(req, res) {
        try {
            const service = new Service({ ...req.body });
            const serv = await Service.create(service);
            const services = await Service.find({});

            res.status(200).json({ service: services });
        } catch (error) {
            console.log(error);
            res.status(401).json({error: error});
        }
    }

    async get(req, res) {
        try {
            const services = await Service.find({'isDeleted': 0});

            res.status(200).json({ service: services });
        } catch (error) {
            console.log(error);
            res.status(401).json({ error: error });
        }
    }

    async findById(req, res) {
        try {
            const service = await Service.findById({_id: req.params.id});

            res.status(200).json({ service: service });
        } catch (error) {
            console.log(error);
            res.status(401).json({error: error});
        }
    }

    async update(req, res) {
        try {
            const service = new Service({ ...req.body });
            const serv = await Service.findByIdAndUpdate(service._id, service, { new: true });

            res.status(200).json({ service: serv });
        } catch (error) {
            console.log(error);
            res.status(401).json({error: error});
        }
    }

    async delete(req, res) {
        try {
            const serv = await Service.findById({ _id: req.params.id });
            serv.isDeleted = 1;
            const service = await Service.findByIdAndUpdate(serv._id, serv, { new: true });

            res.status(200).json({ message: "Successful deletion" });
        } catch (error) {
            console.log(error);
            res.status(401).json({ error: error });
        }
    }
}

module.exports = ServiceController;
const Employe = require("../employe/EmployeModel");
const Service = require("./ServiceModel");
const ServiceService = require("./ServiceService");

const serviceService = new ServiceService();

class ServiceController {

    async create(req, res) {
        try {
            const service = new Service({ ...req.body.service });
            const services = await serviceService.create(service, req.body.employe);

            res.status(200).json({ service: services });
        } catch (error) {
            res.status(401).json({error: error.message});
        }
    }

    async get(req, res) {
        try {
            const resultats = await serviceService.get(req.query.nom);

            res.status(200).json({ service: resultats });
        } catch (error) {
            res.status(401).json({ error: error.message });
        }
    }

    async findById(req, res) {
        try {
            const service = await serviceService.findById(req.params.id);

            res.status(200).json({ service: service });
        } catch (error) {
            res.status(401).json({error: error.message});
        }
    }

    async findByEmploye(req, res) {
        try {
            const employe = await Employe.findById(req.params.idEmploye).populate('services');
            const services = [];
            for (const service of employe.services) {
                if (service.isDeleted == 0) {
                    services.push(service);
                }
            }
            res.status(200).json({ services: services });

        } catch (error) {
            res.status(401).json({error: error.message});
        }
    }

    async update(req, res) {
        try {
            const service = new Service({ ...req.body });
            const serv = await Service.findByIdAndUpdate(service._id, service, { new: true });

            res.status(200).json({ service: serv });
        } catch (error) {
            res.status(401).json({error: error.message});
        }
    }

    async delete(req, res) {
        try {
            const serv = await Service.findById({ _id: req.params.id });
            serv.isDeleted = 1;
            const service = await Service.findByIdAndUpdate(serv._id, serv, { new: true });

            res.status(200).json({ message: "Successful deletion" });
        } catch (error) {
            res.status(401).json({ error: error.message });
        }
    }
}

module.exports = ServiceController;
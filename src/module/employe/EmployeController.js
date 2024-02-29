const Employe = require('./EmployeModel');
const EmployeService = require('./EmployeService');
const { secret_code, Middleware } = require('../../middleware/index');
const HoraireTravail = require('../horaireTravail/HoraireTravailModel');
const HoraireTravailService = require('../horaireTravail/HoraireTravailService');

const mongoose = require('mongoose');

const bcrypt = require('bcrypt');

const employeService = new EmployeService();
const horaireTravailService = new HoraireTravailService();
const middleware = new Middleware();

class EmployeController {
    
    async login(req, res) {
        try {
            const employeLog = new Employe({ ...req.body });
            const employe = await employeService.authentification(employeLog);
            const token = middleware.createToken(employe);

            res.status(200).json({ token: token, employe: employe });
        } catch (error) {
            console.log(error);
            res.status(401).json({ error: error.message });
        }
    }

    async registrate(req, res) {
        try {
            const reqBodyEmp = new Employe({ ...req.body.employe });
            const employe = await employeService.registration(reqBodyEmp);

            if (!req.body.workingHours) {
                res.status(401).json({ error: "L'horaire de travail est absent" });
            }
            const reqBodyWorking = new HoraireTravail({ ...req.body.workingHours });
            reqBodyWorking.employe = employe._id;
            const wh = await horaireTravailService.create(reqBodyWorking);

            res.status(200).json({ message: "Registration succes", employe: employe, workingHours: wh });
        } catch (error) {
            res.status(401).json({ error: error.message });
        }
    }

    async getEmployes(req, res) {
        try {
            const filters = {
                'isDeleted': 0,
                'isManager': 0
            };

            if (req.query.service !== undefined) {
                if (req.query.service.toString() != "") {
                    filters.services = new mongoose.Types.ObjectId(req.query.service);
                }
            }

            if (req.query.nom !== undefined) {
                if (req.query.nom.toString() != "") {
                    filters.nom = { $regex: req.query.nom, $options: 'i' };
                }
            }

            const employe = await Employe.find(filters).populate('services');

            res.status(200).json({ employe: employe });
        } catch (error) {
            res.status(401).json({error: error.message});
        }
    }

    async findById(req, res) {
        try {
            const employe = await Employe.findById({ _id: req.params.id }).populate('services');
            const wh = await HoraireTravail.find({ 'employe': employe._id });

            res.status(200).json({ employe: employe, workingHours: wh });
        } catch (error) {
            console.log(error);
            res.status(401).json({error: error.message});
        }
    }

    async update(req, res) {
        try {
            const reqBodyWorking = new HoraireTravail({ ...req.body.workingHours });
            const reqBodyEmp = new Employe({ ...req.body.employe });
            if (reqBodyEmp.password) {
                reqBodyEmp.password = await bcrypt.hash(reqBodyEmp.password, 10);
            }
            const employe = await Employe.findByIdAndUpdate(reqBodyEmp._id, reqBodyEmp, { new: true });
            reqBodyWorking.employe = employe._id;

            const wh = await horaireTravailService.update(reqBodyWorking);

            res.status(200).json({ employe: employe, workingHours: wh });
        } catch (error) {
            console.log(error);
            res.status(401).json({ error: error.message });
        }
    }

    async delete(req, res) {
        try {
            const emp = await Employe.findById({ _id: req.params.id });
            emp.isDeleted = 1;
            const employe = await Employe.findByIdAndUpdate(emp._id, emp, { new: true });

            res.status(200).json({ message: "Successful deletion" });
        } catch (error) {
            console.log(error);
            res.status(401).json({ error: error.message });
        }
    }

    async getEmployesByService(req, res) {
        try {
            const employe = await Employe.find({ 'services': req.params.idService , 'isDeleted': 0, 'isManager': 0});

            res.status(200).json({ employe: employe });
        } catch (error) {
            console.log(error);
            res.status(401).json({error: error.message});
        }
    }
}

module.exports = EmployeController;
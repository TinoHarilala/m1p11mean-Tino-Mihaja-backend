const Employe = require('./EmployeModel');
const EmployeService = require('./EmployeService');
const { secret_code, Middleware } = require('../../middleware/index');

const employeService = new EmployeService();
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
            res.status(401).json({ error: error });
        }
    }

    async registrate(req, res) {
        try {
            const employeReg = new Employe({ ...req.body });
            const employe = await employeService.registration(employeReg);

            res.status(200).json({ message: "Registration succes", employe: employe });
        } catch (error) {
            console.log(error);
            res.status(401).json({ error: "Registration failed" });
        }
    }

     async getEmployes(req, res) {
        try {
            const employe = await Employe.find({}).populate('services');
            
            res.status(200).json({ employe: employe });
        } catch (error) {
            console.log(error);
            res.status(401).json({error: error});
        }
    }
}

module.exports = EmployeController;
const Employe = require('./EmployeModel');
const bcrypt = require('bcrypt');

class EmployeService {
    async authentification(employe) {
        try {
            const employeLog = await Employe.findOne({
                email: employe.email
            });

            if (!employeLog || !(await bcrypt.compare(employe.password, employeLog.password))) {
                throw new Error('Invalid identifiers');
            }

            return employeLog;

        } catch (error) {
            throw error;
        }
    }

    async registration(employe) {
        try {
            if (employe.password) {
                // Hacher le mot de passe
                employe.password = await bcrypt.hash(employe.password, 10);

                const cl = await Employe.create(employe);
                return cl;
            } else {
                throw new Error("Password is undefined or null");
            }
             
        } catch (error) {
            console.log(error);
            throw new Error("Registration failed in the service");
        }
    }
}

module.exports = EmployeService;
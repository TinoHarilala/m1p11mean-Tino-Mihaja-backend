const Employe = require('./EmployeModel');
const bcrypt = require('bcrypt');

class EmployeService {
    async authentification(employe) {
        try {
            const employeLog = await Employe.findOne({
                email: employe.email
            });

            if (!employeLog || !(await bcrypt.compare(employe.password, employeLog.password))) {
                throw new Error('Identifiants invalides');
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
                throw new Error("Le mot de passe est indéfini ou nul");
            }
             
        } catch (error) {
            console.log(error);
            throw new Error("L'inscription a échoué dans le service");
        }
    }
}

module.exports = EmployeService;
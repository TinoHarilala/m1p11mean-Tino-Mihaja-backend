const Employe = require('../employe/EmployeModel');
const Service = require('./ServiceModel');

class ServiceService {

    async get(nom) {
        try {
             const filters = {'isDeleted': 0 };

            if (nom !== undefined) {
                if (nom.toString() != "") {
                    filters.nom = { $regex: nom, $options: 'i' };
                }
            }

            const services = await Service.find(filters);
            
            const resultatsPromises = services.map(async (service) => {
                const employe = await Employe.find({ 'services': service._id , 'isDeleted': 0, 'isManager': 0});
                return { ...service.toObject(), employe };
            });

            const resultats = await Promise.all(resultatsPromises);

            return resultats;

        } catch (error) {
            throw error;
        }
    }

     async findById(idService) {
        try {
            const services = await Service.find({ 'isDeleted': 0, '_id': idService });
            
            const resultatsPromises = services.map(async (service) => {
                const employe = await Employe.find({ 'services': service._id , 'isDeleted': 0, 'isManager': 0});
                return { ...service.toObject(), employe };
            });

            const resultats = await Promise.all(resultatsPromises);

            return resultats;

        } catch (error) {
            throw error;
        }
    }
  
    async create(service, employes) {
        try {
            const serv = await Service.create(service);

            if (employes) {
                for (const employeId of employes) {
                    const emp = await Employe.findById(employeId);
                    if (emp) {
                        emp.services.push(serv._id);
                        await emp.save();
                    }
                }
            }
                
            const services = await this.get();

            return services;

        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}

module.exports = ServiceService;
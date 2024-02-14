const HoraireTravail = require('./HoraireTravailModel');
const bcrypt = require('bcrypt');

class HoraireTravailService {
    async create(horaireTravail) {
        try {
            const wh = await HoraireTravail.create(horaireTravail);

            return wh;
        } catch (error) {
            throw error;
        }
    }

    async update(horaireTravail) {
        try {
            const wh = await HoraireTravail.findByIdAndUpdate(horaireTravail._id, horaireTravail, {new: true});

            return wh;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = HoraireTravailService;
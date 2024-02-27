const Notification = require("../notification/NotificationModel");


class NotificationController {

    async update(req, res) {
        try {
            const notif = new Notification({ "_id": req.params.id, "status": 1 });
            const n = await Notification.findByIdAndUpdate(notif._id, notif, { new: true });

            res.status(200).json({ message: "Vu" });

        } catch (error) {
            console.log(error);
            res.status(401).json({error: error.message});
        }
    }

      async get(req, res) {
        try {
            const n = await Notification.find({'client': req.params.idClient}).populate('offre');

            res.status(200).json({ notifications: n });

        } catch (error) {
            console.log(error);
            res.status(401).json({error: error.message});
        }
    }

}

module.exports = NotificationController;
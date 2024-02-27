const { ObjectId, Schema, Types, model } = require("mongoose");

const NotificationSchema = new Schema({
    client: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
    offre: { type: Schema.Types.ObjectId, ref: 'OffreSpecial', required: true },
    status: {type: Number, required: true, default: 0}
});

const Notification = model("Notification", NotificationSchema);

module.exports = Notification;
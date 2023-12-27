const { default: mongoose } = require("mongoose");

const hoursSchema = new mongoose.Schema({
    dayOfWeek: { type: String, required: true, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
    openTime: { type: String, required: true },
    closeTime: { type: String, required: true }
});

const Hours = mongoose.model('hours', hoursSchema);
module.exports = Hours;
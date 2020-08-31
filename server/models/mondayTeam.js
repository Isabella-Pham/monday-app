const mongoose = require('mongoose');

const mondayTeamSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true},
    graphs: {type: Array, required: true, default: []},
});

module.exports = mongoose.model('Team', mondayTeamSchema);

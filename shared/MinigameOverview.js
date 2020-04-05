const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const minigameOverviewSchema = mongoose.Schema({
    pacientId: { type: String },
    gameDevice: { type: String },
    respiratoryExercise: { type: String },
    minigameName: { type: String },
    flowDataRounds: [
        {
            minigameRound: Number,
            roundScore: Number,
            roundFlowScore: Number,
            flowDataDevices:  [{ deviceName: String, flowDataId: String }],
        }
    ],
},
    { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

module.exports = mongoose.model('MinigameOverview', minigameOverviewSchema);
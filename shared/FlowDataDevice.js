const mongoose = require('mongoose');

const FlowDataDeviceSchema = mongoose.Schema({
    deviceName: { type: String },
    flowData: [{ flowValue: Number, timestamp: Date }],
},
    { timestamps: { createdAt: 'created_at' } }
);

module.exports = mongoose.model('FlowDataDevice', FlowDataDeviceSchema);
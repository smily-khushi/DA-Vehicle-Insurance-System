import mongoose from 'mongoose';

const policySchema = new mongoose.Schema({
    policyNumber: {
        type: String,
        required: true,
        unique: true
    },
    type: {
        type: String,
        enum: ['Car', 'Bike'],
        required: true
    },
    planName: {
        type: String,
        required: true
    },
    premium: {
        type: Number,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    features: {
        type: [String],
        default: []
    }
}, { timestamps: true });

const Policy = mongoose.model('Policy', policySchema);
export default Policy;

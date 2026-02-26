import mongoose from 'mongoose';

const claimSchema = new mongoose.Schema({
    policyNumber: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    userEmail: {
        type: String,
        required: true
    },
    vehicleNumber: {
        type: String,
        required: true
    },
    incidentDate: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    },
    claimAmount: {
        type: Number,
        default: 0
    },
    readableId: {
        type: String,
        unique: true
    },
    policyDocument: {
        type: String
    },
    repairEstimate: {
        type: String
    }
}, { timestamps: true });

const Claim = mongoose.model('Claim', claimSchema);
export default Claim;

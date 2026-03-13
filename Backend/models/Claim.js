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
    },
    firDocument: {
        type: String
    },
    officerComment: {
        type: String,
        default: null
    },
    processingOfficer: {
        type: String,
        default: null
    },
    processedAt: {
        type: Date,
        default: null
    },
    surveyorEmail: {
        type: String,
        default: null
    },
    surveyorName: {
        type: String,
        default: null
    },
    surveyStatus: {
        type: String,
        enum: ['Pending', 'In Progress', 'Completed'],
        default: 'Pending'
    },
    surveyReport: {
        type: String,
        default: null
    },
    surveyDocument: {
        type: String,
        default: null
    },
    surveyAmount: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

const Claim = mongoose.model('Claim', claimSchema);
export default Claim;
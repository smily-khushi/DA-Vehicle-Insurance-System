import 'dotenv/config';
import mongoose from 'mongoose';
import Policy from './models/Policy.js';

const dummyPolicies = [
    {
        policyNumber: 'SD-1001-VH',
        type: 'Car',
        planName: 'Basic Cover',
        premium: 29,
        duration: '1 Year',
        description: 'Essential protection for budget-conscious drivers.',
        features: ['Third-party Liability', 'Personal Accident Cover', 'Fire & Theft Support']
    },
    {
        policyNumber: 'SD-1002-VH',
        type: 'Car',
        planName: 'Standard Plan',
        premium: 59,
        duration: '1 Year',
        description: 'Comphrensive coverage for complete peace of mind.',
        features: ['Basic Cover Features', 'Comprehensive Damage', 'Natural Calamity Cover', 'Zero Depreciation']
    },
    {
        policyNumber: 'SD-1003-VH',
        type: 'Car',
        planName: 'Premium Shield',
        premium: 99,
        duration: '1 Year',
        description: 'Elite protection with international roadside assistance.',
        features: ['Standard Plan Features', 'Engine Protection', 'Consumables Cover', 'Key Replacement']
    },
    {
        policyNumber: 'SD-2001-BK',
        type: 'Bike',
        planName: 'Two-Wheeler Basic',
        premium: 15,
        duration: '1 Year',
        description: 'Simple protection for your daily commute.',
        features: ['Third-party Liability', 'Personal Accident Cover']
    }
];

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('Connected to MongoDB for seeding policies...');
        await Policy.deleteMany({}); // Clear existing policies
        await Policy.insertMany(dummyPolicies);
        console.log('Dummy policies seeded successfully!');
        process.exit();
    })
    .catch(err => {
        console.error('Error seeding policies:', err);
        process.exit(1);
    });

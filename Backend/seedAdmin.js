import 'dotenv/config';
import mongoose from 'mongoose';
import User from './models/User.js';

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const existingAdmin = await User.findOne({ email: 'admin@safedrive.com' });

        if (existingAdmin) {
            console.log('Admin user already exists. No changes made.');
        } else {
            // Pass plain password — the pre-save hook in User.js will hash it automatically
            const admin = new User({
                fullName: 'SafeDrive Admin',
                email: 'admin@safedrive.com',
                password: 'admin123',
                role: 'admin'
            });

            await admin.save();
            console.log('✅ Admin user created successfully with encrypted password!');
            console.log('   Email   : admin@safedrive.com');
            console.log('   Password: admin123');
        }
    } catch (error) {
        console.error('Error seeding admin:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
};

seedAdmin();



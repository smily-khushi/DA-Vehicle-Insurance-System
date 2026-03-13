import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import policyRoutes from './routes/policy.js';
import claimRoutes from './routes/claim.js';
import contactRoutes from './routes/contact.js';

const app = express();
const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);
const PDFS_DATA_DIR = path.resolve(__dirname, '../Pdfs_Data');

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(PDFS_DATA_DIR));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/policies', policyRoutes);
app.use('/api/claims', claimRoutes);
app.use('/api/contact', contactRoutes);
app.get('/api/test', (req, res) => {
    res.json({ message: 'Routing is working' });
});
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to SafeDrive API' });
});

// Basic Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'up', timestamp: new Date() });
});

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });
import express from 'express';
import Claim from '../models/Claim.js';

import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Multer Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(process.cwd(), '../Pdfs_Data/');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|pdf/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb('Error: Only images (jpeg, jpg, png) and PDFs are allowed!');
        }
    }
});

// GET all claims (for admin)
router.get('/', async (req, res) => {
    try {
        const claims = await Claim.find().sort({ createdAt: -1 });
        res.json(claims);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET claims for a specific user
router.get('/user/:email', async (req, res) => {
    try {
        const claims = await Claim.find({ userEmail: req.params.email }).sort({ createdAt: -1 });
        res.json(claims);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET a single claim by ID
router.get('/:id', async (req, res) => {
    try {
        const claim = await Claim.findById(req.params.id);
        if (!claim) return res.status(404).json({ message: 'Claim not found' });
        res.json(claim);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PATCH update claim status
router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const claim = await Claim.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        if (!claim) return res.status(404).json({ message: 'Claim not found' });
        res.json(claim);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST create a new claim (for user)
router.post('/', upload.fields([
    { name: 'policyDocument', maxCount: 1 },
    { name: 'repairEstimate', maxCount: 1 }
]), async (req, res) => {
    const { policyNumber, userName, userEmail, vehicleNumber, incidentDate, description } = req.body;

    try {
        // Generate a simple readable ID
        const count = await Claim.countDocuments();
        const readableId = `CLM-${(count + 1).toString().padStart(4, '0')}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;

        const newClaim = new Claim({
            policyNumber,
            userName,
            userEmail,
            vehicleNumber,
            incidentDate,
            description,
            readableId,
            policyDocument: req.files['policyDocument'] ? req.files['policyDocument'][0].filename : null,
            repairEstimate: req.files['repairEstimate'] ? req.files['repairEstimate'][0].filename : null
        });

        await newClaim.save();
        res.status(201).json(newClaim);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export default router;

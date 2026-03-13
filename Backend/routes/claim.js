import express from 'express';
import Claim from '../models/Claim.js';

import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);
const PDFS_DATA_DIR = path.resolve(__dirname, '../../Pdfs_Data');

function getDateStamp() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    return `${day}-${month}-${year}`;
}

function getTimeStamp() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    // Use HH-MM (not HH:MM) because ':' is invalid in Windows filenames.
    return `${hours}-${minutes}`;
}

function getDocumentType(fieldName) {
    if (fieldName === 'policyDocument') return 'Policy_Copy';
    if (fieldName === 'repairEstimate') return 'Repair_Cost';
    if (fieldName === 'firDocument') return 'FIR_Copy';
    return 'Document';
}

function getExtension(file) {
    const originalExt = path.extname(file.originalname).toLowerCase();
    if (originalExt) return originalExt;

    if (file.mimetype === 'image/jpeg') return '.jpeg';
    if (file.mimetype === 'image/png') return '.png';
    if (file.mimetype === 'application/pdf') return '.pdf';

    return '';
}

// Multer Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = PDFS_DATA_DIR;
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const dateStamp = getDateStamp();
        const timeStamp = getTimeStamp();
        const documentType = getDocumentType(file.fieldname);
        const extension = getExtension(file);

        // Format: DocumentType_DD-MM-YYYY_HH-MM.ext
        // Example: Repair_Cost_10-03-2026_15-17.jpeg
        const baseName = `${documentType}_${dateStamp}_${timeStamp}`;
        let filename = `${baseName}${extension}`;

        // If a file with same name already exists in the same minute, append a counter.
        let counter = 1;
        while (fs.existsSync(path.join(PDFS_DATA_DIR, filename))) {
            filename = `${baseName}_${counter}${extension}`;
            counter += 1;
        }

        cb(null, filename);
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
router.get('/', async(req, res) => {
    try {
        const claims = await Claim.find().sort({ createdAt: -1 });
        res.json(claims);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET claims for a specific user
router.get('/user/:email', async(req, res) => {
    try {
        const claims = await Claim.find({ userEmail: req.params.email }).sort({ createdAt: -1 });
        res.json(claims);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET a single claim by ID
router.get('/:id', async(req, res) => {
    try {
        const claim = await Claim.findById(req.params.id);
        if (!claim) return res.status(404).json({ message: 'Claim not found' });
        res.json(claim);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PATCH update claim status
router.patch('/:id/status', async(req, res) => {
    try {
        const { status } = req.body;
        const claim = await Claim.findByIdAndUpdate(
            req.params.id, { status }, { new: true }
        );
        if (!claim) return res.status(404).json({ message: 'Claim not found' });

        res.json(claim);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT update claim (for officer actions)
router.put('/:id', async(req, res) => {
    try {
        const { status, comment, officerName } = req.body;
        const allowedStatuses = ['Approved', 'Rejected'];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status. Allowed values: Approved, Rejected' });
        }

        const updatedData = {
            status,
            officerComment: typeof comment === 'string' ? comment.trim() : '',
            processingOfficer: typeof officerName === 'string' && officerName.trim() ? officerName.trim() : 'Officer',
            processedAt: new Date()
        };

        const claim = await Claim.findByIdAndUpdate(
            req.params.id,
            updatedData, { new: true }
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
    { name: 'repairEstimate', maxCount: 1 },
    { name: 'firDocument', maxCount: 1 }
]), async(req, res) => {
    try {
        const { policyNumber, vehicleReg, incidentDate, description, userEmail, userName } = req.body;

        const parsedIncidentDate = new Date(incidentDate);
        if (Number.isNaN(parsedIncidentDate.getTime())) {
            return res.status(400).json({ message: 'Invalid incident date format.' });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        parsedIncidentDate.setHours(0, 0, 0, 0);

        if (parsedIncidentDate > today) {
            return res.status(400).json({ message: 'Incident date cannot be in the future.' });
        }

        // Generate a simple readable ID
        const count = await Claim.countDocuments();
        const readableId = `CLM-${(count + 1).toString().padStart(4, '0')}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;

        const newClaim = new Claim({
            policyNumber: policyNumber,
            vehicleNumber: vehicleReg,
            incidentDate: parsedIncidentDate,
            description: description,
            userEmail: userEmail,
            userName: userName,
            readableId: readableId
        });

        if (req.files) {
            if (req.files.policyDocument) {
                newClaim.policyDocument = req.files.policyDocument[0].filename;
            }
            if (req.files.repairEstimate) {
                newClaim.repairEstimate = req.files.repairEstimate[0].filename;
            }
            if (req.files.firDocument) {
                newClaim.firDocument = req.files.firDocument[0].filename;
            }
        }

        const savedClaim = await newClaim.save();
        res.status(201).json(savedClaim);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// GET claims for a specific surveyor
router.get('/surveyor/:email', async (req, res) => {
    try {
        const claims = await Claim.find({ surveyorEmail: req.params.email }).sort({ createdAt: -1 });
        res.json(claims);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT assign claim to surveyor (for officer)
router.put('/:id/assign-surveyor', async (req, res) => {
    try {
        const { surveyorEmail, surveyorName } = req.body;
        
        if (!surveyorEmail || !surveyorName) {
            return res.status(400).json({ message: 'Surveyor details are required' });
        }

        const claim = await Claim.findByIdAndUpdate(
            req.params.id,
            { 
                surveyorEmail, 
                surveyorName, 
                surveyStatus: 'In Progress' 
            },
            { new: true }
        );

        if (!claim) return res.status(404).json({ message: 'Claim not found' });
        res.json(claim);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT submit survey report (for surveyor)
router.put('/:id/survey', upload.single('surveyDocument'), async (req, res) => {
    try {
        const { surveyReport, surveyAmount } = req.body;
        
        if (!surveyReport || surveyAmount === undefined) {
            return res.status(400).json({ message: 'Survey report and estimated amount are required' });
        }

        const updatedData = {
            surveyReport,
            surveyAmount: Number(surveyAmount),
            surveyStatus: 'Completed',
        };

        if (req.file) {
            updatedData.surveyDocument = req.file.filename;
        }

        const claim = await Claim.findByIdAndUpdate(
            req.params.id,
            updatedData,
            { new: true }
        );

        if (!claim) return res.status(404).json({ message: 'Claim not found' });
        res.json(claim);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
import express from 'express';
import multer from 'multer';
import csv from 'csv-parser';
import fs from 'fs';
import * as xlsx from 'xlsx';
import Policy from '../models/Policy.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// GET all policies
router.get('/', async (req, res) => {
    try {
        const policies = await Policy.find();
        res.json(policies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Import policies from CSV/Excel
router.post('/import', upload.single('file'), async (req, res) => {
    const file = req.file;
    if (!file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const policies = [];
    const filePath = file.path;

    try {
        if (file.originalname.endsWith('.csv')) {
            // Parse CSV
            fs.createReadStream(filePath)
                .pipe(csv())
                .on('data', (data) => policies.push(data))
                .on('end', async () => {
                    await savePolicies(policies, res, filePath);
                });
        } else if (file.originalname.endsWith('.xlsx')) {
            // Parse Excel
            const workbook = xlsx.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
            await savePolicies(sheetData, res, filePath);
        } else {
            res.status(400).json({ message: 'Unsupported file format' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

async function savePolicies(data, res, filePath) {
    try {
        // Map data to schema
        const mappedPolicies = data.map(item => ({
            policyNumber: item.policyNumber,
            type: item.type,
            planName: item.planName,
            premium: Number(item.premium),
            duration: item.duration,
            description: item.description,
            features: item.features ? item.features.split(',').map(f => f.trim()) : []
        }));

        await Policy.insertMany(mappedPolicies);
        fs.unlinkSync(filePath); // Delete temporary file
        res.json({ message: 'Policies imported successfully', count: mappedPolicies.length });
    } catch (error) {
        res.status(400).json({ message: 'Error importing policies: ' + error.message });
    }
}

export default router;

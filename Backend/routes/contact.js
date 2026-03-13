import express from 'express';
import ContactMessage from '../models/ContactMessage.js';

const router = express.Router();

router.post('/', async(req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !subject || !message) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const contact = await ContactMessage.create({
            name: name.trim(),
            email: email.trim(),
            subject: subject.trim(),
            message: message.trim()
        });

        return res.status(201).json(contact);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

router.get('/', async(req, res) => {
    try {
        const contacts = await ContactMessage.find().sort({ createdAt: -1 });
        return res.json(contacts);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

router.patch('/:id/status', async(req, res) => {
    try {
        const { status, adminNote } = req.body;
        const allowedStatuses = ['New', 'In Progress', 'Resolved'];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        const updated = await ContactMessage.findByIdAndUpdate(
            req.params.id, {
                status,
                adminNote: typeof adminNote === 'string' ? adminNote.trim() : ''
            }, { new: true }
        );

        if (!updated) {
            return res.status(404).json({ message: 'Contact message not found' });
        }

        return res.json(updated);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

export default router;
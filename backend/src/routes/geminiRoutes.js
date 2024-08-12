const express = require('express');
const multer = require('multer');
const geminiController = require('../controllers/geminiController');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Route to handle video generation
router.post('/generate-video', upload.single('file'), geminiController.generateVideo);

module.exports = router;

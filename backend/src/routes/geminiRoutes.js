const express = require('express');
const multer = require('multer');
const geminiController = require('../controllers/geminiController');
const upload = multer({ dest: 'uploads/' }); // Set the destination for file uploads

const router = express.Router();

// Authentication routes
router.post('/signup', geminiController.signUpUser);
router.post('/signin', geminiController.signInUser);

// Protected routes (require authentication)
router.post('/generate-video', geminiController.verifyToken, upload.single('file'), geminiController.generateVideo);
router.post('/generate-quiz', geminiController.verifyToken, upload.single('file'), geminiController.generateQuiz);
router.post('/chat', geminiController.verifyToken, geminiController.handleChat);

module.exports = router;

const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const { TextToSpeechClient } = require('@google-cloud/text-to-speech');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { auth, db } = require('../firebase');

// Initialize Google Generative AI Client (Gemini API)
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Initialize Google Cloud Text-to-Speech Client
const textToSpeechClient = new TextToSpeechClient();

// Controller function for user sign-up
exports.signUpUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Create a new user in Firebase Authentication using Admin SDK
    const userRecord = await auth.createUser({
      email: email,
      password: password,
    });

    // Optionally, add additional user data to Firestore
    await db.collection('users').doc(userRecord.uid).set({
      email: userRecord.email,
      createdAt: new Date(),
    });

    // Generate a custom token for the user
    const customToken = await auth.createCustomToken(userRecord.uid);
    res.status(201).send({ message: 'User created successfully', token: customToken });
  } catch (error) {
    console.error('Error creating new user:', error);
    res.status(500).send({ error: 'Failed to create user' });
  }
};

// Controller function for user sign-in
exports.signInUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Verify user's email and password (simplified example, normally handled in frontend)
    const userRecord = await auth.getUserByEmail(email);
    
    // Generate a custom token
    const customToken = await auth.createCustomToken(userRecord.uid);

    res.status(200).send({ token: customToken });
  } catch (error) {
    console.error('Error signing in user:', error);
    res.status(401).send({ error: 'Authentication failed' });
  }
};

// Middleware to verify Firebase ID token
exports.verifyToken = async (req, res, next) => {
  const idToken = req.headers.authorization?.split(' ')[1];

  if (!idToken) {
    return res.status(401).send({ error: 'No token provided' });
  }

  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(401).send({ error: 'Invalid token' });
  }
};

// Controller function for handling file upload and generating video
exports.generateVideo = async (req, res) => {
  const file = req.file;
  const outputDir = path.join(__dirname, '..', 'output');
  const imagesDir = path.join(outputDir, 'images');
  const audioDir = path.join(outputDir, 'audio');
  const videoPath = path.join(outputDir, 'slideshow.mp4');

  fs.mkdirSync(imagesDir, { recursive: true });
  fs.mkdirSync(audioDir, { recursive: true });

  try {
    // Step 1: Convert PDF to images
    const images = await convertPdfToImages(file.path, imagesDir);

    // Step 2: Generate AI explanations using Gemini API
    const explanations = [];
    for (const image of images) {
      const prompt = `Generate a brief, professional explanation for the following slide image content: "${image}"`;
      const result = await model.generateContent({ prompt });
      explanations.push(result.response.text.trim());
    }

    // Step 3: Synthesize voice using Google Cloud Text-to-Speech
    const audioFiles = [];
    const slideDurations = [];
    for (let i = 0; i < explanations.length; i++) {
      const request = {
        input: { text: explanations[i] },
        voice: { languageCode: 'en-US', ssmlGender: 'FEMALE' },
        audioConfig: { audioEncoding: 'MP3' },
      };

      const [response] = await textToSpeechClient.synthesizeSpeech(request);
      const outputFilePath = path.join(audioDir, `audio-${i + 1}.mp3`);
      fs.writeFileSync(outputFilePath, response.audioContent, 'binary');
      audioFiles.push(outputFilePath);

      // Get the duration of the generated audio
      const duration = await getAudioDuration(outputFilePath);
      slideDurations.push(duration);
    }

    // Step 4: Generate video using ffmpeg
    const ffmpegCommand = ffmpeg();
    images.forEach((image, index) => {
      ffmpegCommand.input(image)
        .inputOption(`-t ${slideDurations[index]}`) // Set duration for each slide
        .input(audioFiles[index]);
    });

    ffmpegCommand
      .on('end', () => {
        res.download(videoPath, (err) => {
          if (err) {
            console.error(err);
            res.status(500).send('Error generating video');
          }
        });
      })
      .on('error', (err) => {
        console.error('Error generating video:', err);
        res.status(500).send('Error generating video');
      })
      .output(videoPath)
      .run();

  } catch (error) {
    console.error(error);
    res.status(500).send('Error processing file');
  }
};

// Controller function for quiz generation using Gemini API
exports.generateQuiz = async (req, res) => {
  const outputDir = path.join(__dirname, '..', 'output');

  try {
    const file = req.file;
    const extension = file.originalname.split('.').pop().toLowerCase();
    let content;

    if (extension === 'pdf') {
      content = await convertPdfToImages(file.path, outputDir); // Or another appropriate method to extract text
    } else if (extension === 'ppt' || extension === 'pptx') {
      // Implement a similar method to extract text from PPTX files
      content = await parsePPT(file.path); // Assume you have a parsePPT function
    } else {
      throw new Error('Unsupported file type. Please upload a PDF or PPT file.');
    }

    const prompt = `Generate quiz questions with multiple-choice answers based on the following content: ${content}. Provide the correct answer for each question in the following format:
    Question: ...
    a) Option 1
    b) Option 2
    c) Option 3
    d) Option 4
    Correct Answer: b) Option 2`;

    const result = await model.generateContent({ prompt });

    const quiz = result.response.text;
    res.json({ quiz });
  } catch (error) {
    console.error('Error generating quiz:', error);
    res.status(500).json({ error: error.message });
  }
};

// Controller function for handling chatbot interaction using Gemini API
exports.handleChat = async (req, res) => {
  try {
    const { message } = req.body;
    const prompt = `Respond to the following message as a helpful AI tutor: "${message}"`;

    const result = await model.generateContent({ prompt });

    const botResponse = result.response.text;
    res.json({ response: botResponse });
  } catch (error) {
    console.error('Error generating chat response:', error);
    res.status(500).json({ error: error.message });
  }
};

// Helper to convert PDF to images
async function convertPdfToImages(pdfPath, outputDir) {
  // Use an appropriate PDF-to-image conversion library here
  // This is a placeholder for actual PDF to image conversion logic
  const pdfImage = new PdfImage(pdfPath);
  const images = [];
  const totalPages = await pdfImage.getNumberOfPages();
  for (let i = 0; i < totalPages; i++) {
    const outputFilePath = path.join(outputDir, `page-${i + 1}.png`);
    await pdfImage.convertPage(i).then(() => {
      images.push(outputFilePath);
    });
  }
  return images;
}

// Helper to get the duration of an audio file using ffprobe
function getAudioDuration(filePath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) return reject(err);
      const duration = metadata.format.duration;
      resolve(duration);
    });
  });
}

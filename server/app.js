const sequelize = require('./connection');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const userRoute = require('./routers/userRouter');
const chatRoute = require('./routers/chatRouter');
const messageRoute = require('./routers/messageRouter');
const { connection } = require('./connection');
const multer = require('multer');
const UserModel = require('./models/User');
const fs = require('fs'); 
const path = require('path');

const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });

// call routes
app.use("/api/users", userRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);

// Multer storage configuration
const storage = multer.diskStorage({
    // destination: './upload/images',
    destination: function (req, file, cb) {
        const uploadDir = './upload/images';
        fs.mkdirSync(uploadDir, { recursive: true }); // Create directory if it doesn't exist
        cb(null, uploadDir); // Upload files to the 'uploads' directory
    },
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
});

// Initialize multer upload middleware
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
});

// Serve static files
app.use("/images", express.static('upload/images'));

// POST route for uploading image
app.post("/upload", upload.single('image'), (req, res) => {
    if (req.file) {
        // Image uploaded successfully
        const imageUrl = `http://localhost:3001/images/${req.file.filename}`; // Change URL as needed
        // Here you can save imageUrl to your database or do further processing
        res.json({
            success: 1,
            imageUrl: imageUrl
        });
    } else {
        // No file uploaded
        res.status(400).json({
            success: 0,
            message: 'No file uploaded'
        });
    }
});



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});



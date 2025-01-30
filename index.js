require('dotenv').config();
require('./db/config');
const { specs, swaggerUi } = require('./swagger/swagger');

const express = require('express');
const cors = require('cors');
const expressFileUpload = require('express-fileupload');
const path = require('path');
const bodyParser = require('body-parser');
const userRouter = require('./routes/user');
const authRouter = require('./routes/auth');
const productRouter = require('./routes/product');

const app = express();
app.use(cors());

// Parse requests of content-type - application/json
app.use(express.json());
// Parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// File upload configuration options for express-fileupload
const fileUploadOptions = {
  createParentPath: true,
  limits: { fileSize: 50 * 1024 * 1024 },  // Limit file size to 50 MB
  useTempFiles: true,  // Use temporary files
  tempFileDir: '/tmp/', 
};

// Initialize express-fileupload with the configuration
app.use(expressFileUpload(fileUploadOptions));

// Serve static files (uploaded images)
app.use('/uploads', express.static('uploads'));

// Parse requests using body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Routes
app.use('/api', userRouter.router);
app.use('/api', authRouter.router);
app.use('/api', productRouter.router);

app.get('/', (req, res) => {
  res.send('Browser server working');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started: http://localhost:${PORT}`);
});

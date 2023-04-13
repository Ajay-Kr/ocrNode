const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const cors = require('cors');

const app = express();

const ImageRoute = require('./Routes/Image.route')

app.use(cors());
app.use(express.json());
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: path.join(__dirname, 'tmp'),
  createParentPath: true,
  limits: {fileSize: 5 * 1024 * 1024}
}));

app.use('/image', ImageRoute);


app.listen(5000, () => {
  console.log('🚀 listning at port 5000...');
});
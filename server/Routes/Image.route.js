const router = require('express').Router();
const getText = require('../helper/ocrSpace');
const path = require('path');

router.get('/', async (req, res, next) => {
  res.send('Get image')
});

router.post('/', async (req, res, next) => {
  const imagePath = 'C:/Users/Dell/Desktop/dl.png';
  try {
    const imageFile = req.files.file;
    const fileName = new Date().getTime().toString() + path.extname(imageFile.name);
    const savePath = path.join(__dirname, '../', 'public', 'uploads', fileName);

    imageFile.mv(savePath, async (err) => {
      if(err) {
        return res.status(500).send(err);
      }
      const outputData = await getText(savePath);
      console.log(outputData);
      if(outputData && outputData !== undefined) 
      res.json(outputData);
    })
    // if(file.truncated) {
    //   throw new Error('File size is too big...');
    // }

    // const outputData = await getText(savePath);
    // console.log(outputData);
    // res.json({outputData});
  } catch (error) {
    console.error(error);
  }

  // const out = await getText('C:/Users/Dell/Desktop/dl.png');
  // if(out && out.length <= 0) res.send({result: 'Not processed'})
  // res.send(out);
});

module.exports = router;
const { ocrSpace } = require('ocr-space-api-wrapper');

const options =  { 
  apikey: 'K83645853188957',
  language: 'eng', // English
  // imageFormat: 'image/png', // Image Type (Only png ou gif is acceptable at the moment i wrote this)
  // isOverlayRequired: true
};

function isPan(outText) {
  const reg1 = /TAX/;
  const reg2 = /INCOME/;
  const reg3 = /INCOME TAX DEPARTMENT/;
  if (reg1.test(outText) || reg2.test(outText) || reg3.test(outText) ) 
    return true;
}

function isDL(outText) {
  const reg1 = /Transport/;
  const reg2 = /Transport Department Government/;
  if (reg1.test(outText) || reg2.test(outText)) 
    return true;
}

function isAadhar(outText) {
  const reg1 = /[0-9]{4}\s[0-9]{4}\s[0-9]{4}/;
  if (reg1.test(outText)) 
    return true;
}

function getPanInfo(outText) {
  const arr = outText.split('\n');

  return {
    idType: 'panCard',
    idNumber: arr[5].split('\r')[0],
    info: {
      name: arr[1].split('\r')[0],
      fatherName: arr[2].split('\r')[0],
      dob: arr[3].split('\r')[0]
    }
  }
}

function getDLInfo(outText) {
  const arr = outText.split('\n');

  return {
    idType: 'drivingLicence',
    idNumber: arr[7].split('\r')[0],
    info: {
      name: arr[8].split('\r')[0],
      fatherName: arr[9].split('\r')[0],
      dob: arr[10].split(' ')[1]
    }
  }
}

function getAadharInfo(outText) {
  const arr = outText.split('\n');
  console.log('arr: ', arr);

  return {
    idType: 'aadhar',
    idNumber: arr[3].split('\r')[0],
    info: {
      name: arr[1].split('\r')[0],
      dob: arr[2].split('\r')[0]
    }
  }
}

async function getText (imagePath) {
  try {    
    // Using your personal API key + base64 image + custom language
    const response = await ocrSpace(imagePath, options);
    // return res3.ParsedResult;
    const resText = response.ParsedResults[0].ParsedText;

    const output = isPan(resText) ? getPanInfo(resText) : (
      isDL(resText) ? getDLInfo(resText) : (
        isAadhar(resText) ? getAadharInfo(resText) : null
      )
    );

    // console.log(output)
    return output;
  } catch (error) {
    console.error(error);
  }
}

// getText('C:/Users/Dell/Desktop/dl.png');

// out.then( parsedText => console.log(parsedText));

module.exports = getText;
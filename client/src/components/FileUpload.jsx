import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = () => {
  const [selectedImage, setSelectedImage] = useState();
  const [fileName, setFileName] = useState('');
  const [recdData, setRecdData] = useState({});

  const imageChange = (e) => {
    if(e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
      setFileName(e.target.files[0].name);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    // alert(URL.createObjectURL(selectedImage));
    const formData = new FormData();
    formData.append('file', selectedImage);

    try {
      const res = await axios.post('http://localhost:5000/image/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log(res.data);
      const outObj = flattenObj(res.data);
      // console.log(outObj);
      setRecdData(outObj);
      
    } catch (err) {
      if(err.response.status === 500) {
        console.log('There was a problem with the server');
      } else {
        console.log(err);
      }
    }
  }

  const flattenObj = (ob) => {
    let result = {};
    for (const i in ob) {
      if ((typeof ob[i]) === 'object' && !Array.isArray(ob[i])) {
        const temp = flattenObj(ob[i]);
        for (const j in temp) {
            result[i + '.' + j] = temp[j];
        }
      }
      else {
        result[i] = ob[i];
      }
    }
    return result;
  };

  const getKeyValues = (ob) => {
    let result = {};
    
    for (const i in ob) {
        if ((typeof ob[i]) === 'object' && !Array.isArray(ob[i])) {
            const temp = getKeyValues(ob[i]);
            for (const j in temp) {
                result[i + '.' + j] = temp[j];
            }
        }
        else {
            result[i] = ob[i];
        }
    }
    return result;
  }

  return (
    <>
    
    <div className="container">
      <div className="row">
        <form onSubmit={onSubmit} className="form-inline mb-4">
          <div className="mb-4">
            <label htmlFor="formFile" className="form-label"></label>
            <input className="form-control" onChange={imageChange} type="file" id="formFile" accept="image/*" />
          </div>

          <div className="d-grid gap-2">
            <button className="btn btn-primary" type="submit">Upload</button>
          </div>
        </form>
      </div>
      
    </div>

      
        {
          selectedImage && (
            <div className='row align-item-center' style={styles.infoContainer}>

                <h4>{ fileName }</h4>
              <div style={styles.preview} className='col'>
                <img 
                  src={URL.createObjectURL(selectedImage)} 
                  style={styles.image}
                  alt="Thumb" 
                />
              </div>

              { recdData ?
                  <div style={styles.dataContainer} className="col">
                    <ul style={styles.dataList} className="list-unstyled">
                      {
                        Object.keys(recdData).map((key) => {
                          return <li key={key}>{key}: {recdData[key]}</li>
                        }) 
                      }
                    </ul>
                  </div>
                : null
              }

            </div>
          )
        }
    </>

  )
}

export default FileUpload;

const styles = {
  infoContainer: {
    padding: '20px auto',
    margin: 'auto',
    maxWidth: '90%',
    backgroundColor:' #D4D4D4',
    border: '2px solid #5b7d88',
    borderRadius: 10,
    textAlign: 'center'
  },
  preview: {
    margin: 'auto',
    display: "inline-block",
  },
  image: { maxWidth: "80%", maxHeight: 320 , borderRadius: '5px'},
  dataContainer: { 
    height: '100%', 
    minHeight: '100%',
    display: 'inline-block',
    margin: '30px 20px', 
    borderLeft: '3px solid rgba(173, 173, 173, .8)',
  },
  dataList: {
    textAlign: 'left',
    fontSize: 16,
    textTransform: 'capitalize',
  }

};
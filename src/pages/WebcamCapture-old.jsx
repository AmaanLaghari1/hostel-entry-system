import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';

const WebcamCapture = () => {
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);

    // Create today's date folder name
    const today = new Date().toISOString().split("T")[0];

    // File name
    const fileName = `${today}_capture_${Date.now()}.jpg`;

    // Trigger download
    const link = document.createElement("a");
    link.href = imageSrc;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

  }, [webcamRef]);

  const retake = () => {
    setImgSrc(null);
  };

  return (
    <div className="webcam-container">
      {imgSrc ? (
        <div className='d-flex flex-column'>
          <img width={170} height={170} className='img-thumbnail m-2' src={imgSrc} alt="captured" />
          <button className='btn btn-danger' onClick={retake}>Retake photo</button>
        </div>
      ) : (
        <div className='d-flex flex-column'>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={200}
            height={200}
            videoConstraints={{
              facingMode: "user"
            }}
          />
          <button className='btn btn-danger' onClick={capture}>Capture photo</button>
        </div>
      )}
    </div>
  );
};

export default WebcamCapture;
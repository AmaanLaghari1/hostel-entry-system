import React, { useRef, useState, useCallback, forwardRef, useImperativeHandle } from "react";
import Webcam from "react-webcam";
import axios from "axios";

const videoConstraints = {
  width: 720,
  height: 720,
  facingMode: "user"
};

const WebcamCapture = forwardRef((props, ref) => {
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);

  const capture = useCallback(async () => {
    if (!webcamRef.current) return;

    const imageSrc = webcamRef.current.getScreenshot();

    if (!imageSrc) {
      alert("Camera not ready");
      return;
    }

    setImgSrc(imageSrc);

    // try {
    //   const response = await axios.post("http://localhost:5000/save-photo", {
    //     image: imageSrc
    //   });

    //   console.log("Photo saved:", response.data);
    //   return imageSrc; // Return the captured image source

    // } catch (error) {
    //   console.log(error.response);
    // }
    return imageSrc; // Return the captured image source
  }, []);

  // Expose capture() to parent
  useImperativeHandle(ref, () => ({
    capture,
    imgSrc
  }));

  return (
    <div className="webcam-container">
      <div className="d-flex flex-column align-items-center">
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          screenshotQuality={1}
          width={200}
          height={200}
        />
      </div>

      {/* {imgSrc && (
        <img
          src={imgSrc}
          alt="capture"
          width={100}
          height={100}
          className="img-thumbnail mt-2"
        />
      )} */}
    </div>
  );
});

export default WebcamCapture;
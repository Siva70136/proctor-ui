import React, { useState, useRef, useEffect } from "react";
import html2canvas from "html2canvas"; // Import html2canvas

const Proctor = () => {
  const [capturing, setCapturing] = useState(false);
  const [enableCamera, setEnableCamera] = useState(false);
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [responses, setResponses] = useState([]);
  const videoRef = useRef(null);
  const captureIntervalRef = useRef(null);

  useEffect(() => {
    // Start the camera only when userId is entered
    const startCamera = async () => {
      if (!enableCamera) return;
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        alert("Failed to access camera: " + err);
      }
    };

    startCamera();

    // Cleanup the camera stream when the component unmounts
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [enableCamera]);

  const captureImageAndSend = async () => {
    if (!userId) {
      alert("Please enter a User ID.");
      return;
    }

    setLoading(true);

    const videoElement = videoRef.current;
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const videoWidth = videoElement.videoWidth;
    const videoHeight = videoElement.videoHeight;

    canvas.width = videoWidth;
    canvas.height = videoHeight;
    context.drawImage(videoElement, 0, 0, videoWidth, videoHeight);
    const imageBase64 = canvas.toDataURL("image/jpeg");

    try {
      // Capture the window snapshot using html2canvas
      const windowCanvas = await html2canvas(document.body); // Capture the full window
      const windowBase64 = windowCanvas.toDataURL("image/jpeg");

      const payload = {
        userId: userId,
        img_url: imageBase64,
        window_snapshot: windowBase64, // Include the window snapshot
      };
      console.log(payload);

      // Send the data (mocked API call here)
      // const response = await fetch("https://your-api-url.com", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(payload),
      // });

      // const data = await response.json();
      // const parsed = JSON.parse(data);

      setLoading(false);

      // Update responses state
      // setResponses((prevResponses) => [
      //   ...prevResponses,
      //   {
      //     imageBase64,
      //     flags: parsed.flags,
      //     windowSnapshot: windowBase64, // Include window snapshot in response
      //   },
      // ]);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to send image to API: " + error);
      setLoading(false);
    }
  };

  const toggleCapture = () => {
    if (!userId) {
      alert("Please enter a User ID before starting capture.");
      return;
    }

    if (!capturing) {
      setCapturing(true);
      captureIntervalRef.current = setInterval(captureImageAndSend, 5000);
    } else {
      setCapturing(false);
      clearInterval(captureIntervalRef.current);
    }
  };

  const setCamera = (e) => {
    e.preventDefault();
    setEnableCamera(true);
  };

  return (
    <div className="">
      <div className="max-w-2xl mx-auto my-10 bg-white rounded-lg shadow-xl p-6">
        <div className="mb-4">
          <label
            htmlFor="userId"
            className="block text-lg font-medium text-gray-700"
          >
            User ID:
          </label>
          <form className="flex">
            <input
              type="text"
              id="userId"
              className="mt-1 mr-2 block w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
            />

            <button
              onClick={setCamera}
              className="px-4 py-1 bg-blue-500 text-white rounded-md focus:outline-none"
            >
              Enter
            </button>
          </form>
        </div>

        {/* Camera Stream */}
        {enableCamera && (
          <div className="">
            <div id="cameraContainer" className="mb-6">
              <video
                ref={videoRef}
                className="mx-auto border-2 rounded-md h-80"
                autoPlay
              />
            </div>
            <div className="mt-6 text-center">
              <button
                onClick={toggleCapture}
                className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 focus:outline-none"
              >
                {capturing ? "Stop Capture" : "Start Capture"}
              </button>
            </div>
          </div>
        )}

        {/* Loading Spinner */}
        {loading && (
          <div id="loadingSpinner" className="text-center mt-4">
            <svg
              className="animate-spin h-8 w-8 mx-auto text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 0116 0A8 8 0 014 12z"
              ></path>
            </svg>
            <p className="text-gray-600 mt-2">Sending image to API...</p>
          </div>
        )}
      </div>

      {/* API Response and Image Display */}
      {responses.length > 0 && (
        <div id="responseSection" className="mt-6">
          <div className="text-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              API Responses:
            </h2>
          </div>
          <div id="responsesContainer" className="space-y-6">
            {responses.map((response, index) => (
              <div
                key={index}
                className="grid grid-cols-2 gap-4 bg-white p-4 rounded-lg shadow-lg border"
              >
                {/* Column 1: Image */}
                <div>
                  <img
                    src={response.imageBase64}
                    alt="Captured"
                    className="rounded-md shadow-lg max-w-full"
                  />
                  {/* Display window snapshot */}
                  <img
                    src={response.windowSnapshot}
                    alt="Window Snapshot"
                    className="mt-4 rounded-md shadow-lg max-w-full"
                  />
                </div>
                {/* Column 2: Response */}
                <div>
                  <ul className="space-y-2 text-gray-600">
                    {response.flags.map((flag, idx) => (
                      <li
                        key={idx}
                        className="bg-indigo-50 p-2 rounded shadow hover:bg-indigo-100"
                      >
                        <strong>{flag.flag_type}</strong>:{" "}
                        {flag.description_test_taker}
                        <br />
                        Confidence: {flag.confidence * 100}%
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Proctor;

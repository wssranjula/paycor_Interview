import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Video, VideoOff, User } from 'lucide-react';
import * as faceapi from 'face-api.js';

interface VideoFeedProps {
  isEnabled: boolean;
}

const VideoFeed: React.FC<VideoFeedProps> = ({ isEnabled }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>('');
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [faceData, setFaceData] = useState<{ width: number; height: number }[]>([]); // To store face sizes

  // Define video dimensions explicitly for consistent behavior
  const videoWidth = 360;
  const videoHeight = 180;

  // Load face-api.js models
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = '/models'; // Ensure your models folder is accessible here
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL); // Needed for some drawing functions
        // If you need face expressions or age/gender, uncomment these and make sure models are in /models
        // await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
        // await faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL);
        setModelsLoaded(true);
        console.log('Face-API models loaded successfully!');
      } catch (err) {
        console.error('Error loading face-api models:', err);
        setError('Failed to load face detection models. Check console for details and model path.');
      }
    };
    loadModels();
  }, []);

  // Function to start face detection and drawing
  const startFaceDetection = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !modelsLoaded) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const displaySize = { width: videoWidth, height: videoHeight };

    // Match canvas dimensions to video dimensions
    faceapi.matchDimensions(canvas, displaySize);

    const detectionInterval = setInterval(async () => {
      if (!videoRef.current || videoRef.current.paused || videoRef.current.ended) {
        clearInterval(detectionInterval);
        return;
      }

      // Perform face detection
      const detections = await faceapi.detectAllFaces(
        video,
        new faceapi.TinyFaceDetectorOptions()
      ).withFaceLandmarks(); // Include landmarks if you plan to draw them or need them for other features
      // .withFaceExpressions() // Uncomment if you loaded faceExpressionNet
      // .withAgeAndGender(); // Uncomment if you loaded ageGenderNet

      // Resize detected boxes to fit the canvas dimensions
      const resizedDetections = faceapi.resizeResults(detections, displaySize);

      // Get 2D rendering context
      const context = canvas.getContext('2d');
      if (context) {
        context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas before drawing

        // Store face dimensions
        const currentFaceData = resizedDetections.map(det => ({
          width: Math.round(det.detection.box.width),
          height: Math.round(det.detection.box.height),
        }));
        setFaceData(currentFaceData);

        // Draw the detections (rectangles)
        faceapi.draw.drawDetections(canvas, resizedDetections);

        // Optional: Draw face landmarks (points on face)
        // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

        // Optional: Draw expressions, age, gender labels
        // faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
        // resizedDetections.forEach(detection => {
        //   const box = detection.detection.box;
        //   const text = `${Math.round(detection.age || 0)} years, ${detection.gender || ''}`;
        //   new faceapi.draw.DrawTextField([text], box.bottomLeft).draw(canvas);
        // });
      }
    }, 100); // Run detection every 100ms for smooth performance

    // Clear interval when component unmounts or video stops
    return () => clearInterval(detectionInterval);
  }, [modelsLoaded, videoWidth, videoHeight]); // Add dependencies

  useEffect(() => {
    const setupVideo = async () => {
      if (isEnabled && modelsLoaded) {
        try {
          const mediaStream = await navigator.mediaDevices.getUserMedia({
            video: { width: { ideal: videoWidth }, height: { ideal: videoHeight } }, // Request specific resolution
            audio: false
          });
          setStream(mediaStream);
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
            videoRef.current.onplay = () => {
              // Ensure canvas dimensions are set AFTER video metadata is loaded
              if (canvasRef.current) {
                canvasRef.current.width = videoRef.current!.videoWidth;
                canvasRef.current.height = videoRef.current!.videoHeight;
              }
              startFaceDetection(); // Start detection once video is playing
            };
          }
          setError('');
        } catch (err) {
          console.error('Error accessing camera:', err);
          setError('Unable to access camera. Please check permissions or try a different browser.');
        }
      } else {
        // Stop stream and clear canvas when disabled
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
          setStream(null);
        }
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
        if (canvasRef.current) {
          const context = canvasRef.current.getContext('2d');
          if (context) {
            context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          }
        }
        setFaceData([]); // Clear face data
      }
    };

    setupVideo();

    // Cleanup on unmount or dependency change
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      // Stop ongoing detection if any
      // The startFaceDetection useCallback handles its own interval cleanup
    };
  }, [isEnabled, modelsLoaded, startFaceDetection, videoWidth, videoHeight]);

  if (!isEnabled) {
    return (
      <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-video flex items-center justify-center">
        <div className="text-center text-gray-500">
          <VideoOff className="h-12 w-12 mx-auto mb-2" />
          <p className="text-sm">Camera disabled</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative bg-red-50 rounded-lg overflow-hidden aspect-video flex items-center justify-center border border-red-200">
        <div className="text-center text-red-600">
          <User className="h-12 w-12 mx-auto mb-2" />
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!modelsLoaded) {
    return (
      <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-video flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p className="text-sm">Loading face detection models...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="w-full h-full object-cover absolute top-0 left-0"
        width={videoWidth} // Explicit width
        height={videoHeight} // Explicit height
      />
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0"
        width={videoWidth} // Match video width
        height={videoHeight} // Match video height
      />
      <div className="absolute top-2 right-2">
        <div className="bg-green-500 text-white p-1 rounded-full">
          <Video className="h-4 w-4" />
        </div>
      </div>
      <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
        Live
      </div>
      {faceData.length > 0 && (
        <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs z-10">
          {faceData.map((data, index) => (
            <p key={index}>Face {index + 1}: {data.width}x{data.height} px</p>
          ))}
        </div>
      )}
    </div>
  );
};

export default VideoFeed;
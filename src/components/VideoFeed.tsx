
import React, { useEffect, useRef, useState } from 'react';
import { Video, VideoOff, User } from 'lucide-react';

interface VideoFeedProps {
  isEnabled: boolean;
}

const VideoFeed: React.FC<VideoFeedProps> = ({ isEnabled }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const startVideo = async () => {
      if (isEnabled) {
        try {
          const mediaStream = await navigator.mediaDevices.getUserMedia({ 
            video: true, 
            audio: false 
          });
          setStream(mediaStream);
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
          }
          setError('');
        } catch (err) {
          console.error('Error accessing camera:', err);
          setError('Unable to access camera. Please check permissions.');
        }
      } else {
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
          setStream(null);
        }
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
      }
    };

    startVideo();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isEnabled]);

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

  return (
    <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="w-full h-full object-cover"
      />
      <div className="absolute top-2 right-2">
        <div className="bg-green-500 text-white p-1 rounded-full">
          <Video className="h-4 w-4" />
        </div>
      </div>
      <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
        Live
      </div>
    </div>
  );
};

export default VideoFeed;

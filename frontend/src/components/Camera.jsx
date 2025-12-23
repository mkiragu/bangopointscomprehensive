import { useState, useRef, useEffect } from 'react';
import { Camera as CameraIcon, X, RefreshCw } from 'lucide-react';

const Camera = ({ onCapture, onClose }) => {
  const [stream, setStream] = useState(null);
  const [facingMode, setFacingMode] = useState('environment'); // 'user' or 'environment'
  const [error, setError] = useState(null);
  const [capturing, setCapturing] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    startCamera();
    
    return () => {
      stopCamera();
    };
  }, [facingMode]);

  const startCamera = async () => {
    try {
      setError(null);
      
      const constraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Camera error:', err);
      
      if (err.name === 'NotAllowedError') {
        setError('Camera permission denied. Please allow camera access in your browser settings.');
      } else if (err.name === 'NotFoundError') {
        setError('No camera found on this device.');
      } else {
        setError('Failed to access camera. Please try again.');
      }
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const capture = () => {
    if (!videoRef.current || !canvasRef.current) return;

    setCapturing(true);
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Get image as base64
    const imageData = canvas.toDataURL('image/jpeg', 0.95);
    
    // Stop camera
    stopCamera();
    
    // Pass image to parent
    if (onCapture) {
      onCapture(imageData);
    }
    
    setCapturing(false);
  };

  const switchCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  const handleClose = () => {
    stopCamera();
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Camera view */}
      <div className="relative w-full h-full">
        {error ? (
          <div className="flex items-center justify-center h-full p-6">
            <div className="text-center">
              <CameraIcon className="w-16 h-16 mx-auto mb-4 text-red-500" />
              <p className="text-white mb-4">{error}</p>
              <button
                onClick={startCamera}
                className="btn-primary"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            
            {/* Hidden canvas for capture */}
            <canvas
              ref={canvasRef}
              style={{ display: 'none' }}
            />

            {/* Controls overlay */}
            <div className="absolute inset-0 flex flex-col justify-between p-4">
              {/* Top controls */}
              <div className="flex justify-between items-center">
                <button
                  onClick={handleClose}
                  className="p-3 rounded-full bg-black/50 text-white hover:bg-black/70"
                  aria-label="Close camera"
                >
                  <X className="w-6 h-6" />
                </button>
                
                <button
                  onClick={switchCamera}
                  className="p-3 rounded-full bg-black/50 text-white hover:bg-black/70"
                  aria-label="Switch camera"
                >
                  <RefreshCw className="w-6 h-6" />
                </button>
              </div>

              {/* Bottom controls */}
              <div className="flex justify-center items-center pb-8">
                <button
                  onClick={capture}
                  disabled={capturing}
                  className="w-20 h-20 rounded-full border-4 border-white bg-white/20 hover:bg-white/30 active:scale-95 transition-all disabled:opacity-50"
                  aria-label="Capture photo"
                >
                  <div className="w-full h-full rounded-full border-2 border-white" />
                </button>
              </div>
            </div>

            {/* Capture hint */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <div className="text-white text-center bg-black/50 px-4 py-2 rounded-lg">
                <p className="text-sm">Position receipt in frame</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Camera;

import React, { useRef, useState, useEffect } from 'react';
import { ReactSketchCanvas } from 'react-sketch-canvas';
import { Eraser, Save, Undo, Eye, Palette } from 'lucide-react';
import axios from 'axios';
import PreviewModal from './PreviewModal';

const ImageEditor = () => {
  const [image, setImage] = useState<string | null>(null);
  const [strokeWidth, setStrokeWidth] = useState(12);
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [showPreview, setShowPreview] = useState(false);
  const [maskPreview, setMaskPreview] = useState<string | null>(null);
  const canvasRef = useRef<any>(null);
  const [loading, setLoading] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const colors = [
    '#000000', // Black
    '#FF0000', // Red
    '#00FF00', // Green
    '#0000FF', // Blue
    '#FFFF00', // Yellow
    '#FF00FF', // Magenta
    '#00FFFF', // Cyan
    '#FFFFFF', // White
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const img = new Image();
      const reader = new FileReader();
      reader.onload = (event) => {
        img.onload = () => {
          const maxWidth = 800;
          const aspectRatio = img.width / img.height;

          let width = img.width;
          let height = img.height;

          if (img.width > maxWidth) {
            width = maxWidth;
            height = maxWidth / aspectRatio;
          }

          setDimensions({ width, height });
          setImage(event.target?.result as string);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePreview = async () => {
    if (!canvasRef.current || !image) return;

    const maskData = await canvasRef.current.exportImage('png');

    const img = new Image();
    const maskImg = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0, img.width, img.height);

      maskImg.onload = () => {
        ctx?.drawImage(maskImg, 0, 0, img.width, img.height);
        const combinedImage = canvas.toDataURL('image/png');
        setMaskPreview(combinedImage);
        setShowPreview(true);
      };

      maskImg.src = maskData;
    };

    img.src = image;
  };

  const handleSave = async () => {
    if (!canvasRef.current || !image || !maskPreview) return;

    setLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:8000/upload',
        {
          original_image: image.split(',')[1],
          mask_image: maskPreview.split(',')[1],
        },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (response.status === 200) {
        alert('Images saved successfully!');
        canvasRef.current?.clearCanvas();
        setImage(null);
        setMaskPreview(null);
        setShowPreview(false);
      }
    } catch (error) {
      console.error('Error saving images:', error);
      alert('Failed to save images. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"
          />
        </div>

        {image && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div className="flex items-center space-x-2">
                <Palette className="h-5 w-5 text-gray-600" />
                <label className="text-sm font-medium text-gray-700">Color:</label>
                <div className="flex space-x-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setStrokeColor(color)}
                      className={`w-6 h-6 rounded-full border-2 ${
                        strokeColor === color ? 'border-indigo-600' : 'border-gray-200'
                      }`}
                      style={{
                        backgroundColor: color,
                        boxShadow: color === '#FFFFFF' ? 'inset 0 0 0 1px #E5E7EB' : 'none'
                      }}
                      title={color}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">
                  Brush Size: {strokeWidth}px
                </label>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={strokeWidth}
                  onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
                  className="w-48"
                />
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => canvasRef.current?.undo()}
                  className="p-2 rounded-md hover:bg-gray-100"
                  title="Undo"
                >
                  <Undo className="h-5 w-5 text-gray-600" />
                </button>
                <button
                  onClick={() => canvasRef.current?.clearCanvas()}
                  className="p-2 rounded-md hover:bg-gray-100"
                  title="Clear"
                >
                  <Eraser className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>

            <div
              className="border rounded-lg overflow-hidden"
              style={{
                width: `${dimensions.width}px`,
                height: `${dimensions.height}px`,
                backgroundImage: `url(${image})`,
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            >
              <ReactSketchCanvas
                ref={canvasRef}
                strokeWidth={strokeWidth}
                strokeColor={strokeColor}
                canvasColor="transparent"
                style={{
                  width: `${dimensions.width}px`,
                  height: `${dimensions.height}px`,
                }}
              />
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handlePreview}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Eye className="h-5 w-5 mr-2" />
                Preview
              </button>

              <button
                onClick={handleSave}
                disabled={loading || !maskPreview}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                <Save className="h-5 w-5 mr-2" />
                {loading ? 'Saving...' : 'Save Images'}
              </button>
            </div>
          </div>
        )}
      </div>

      {showPreview && maskPreview && (
        <PreviewModal
          originalImage={image!}
          maskImage={maskPreview}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
};

export default ImageEditor;
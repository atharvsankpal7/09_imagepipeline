import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Trash2 } from 'lucide-react';

interface ImagePair {
  id: number;
  original_url: string;
  mask_url: string;
  created_at: string;
}

const Gallery = () => {
  const [images, setImages] = useState<ImagePair[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchImages = async () => {
    try {
      const response = await axios.get('http://localhost:8000/images');
      setImages(response.data);
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this image pair?')) return;

    try {
      await axios.delete(`http://localhost:8000/images/${id}`);
      setImages(images.filter(img => img.id !== id));
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Failed to delete image');
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">Image Gallery</h2>
      <div className="grid grid-cols-1 gap-8">
        {images.map((pair) => (
          <div key={pair.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm text-gray-500">
                Created: {new Date(pair.created_at).toLocaleDateString()}
              </div>
              <button
                onClick={() => handleDelete(pair.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-full"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Original Image</h3>
                <img
                  src={pair.original_url}
                  alt="Original"
                  className="w-full h-auto rounded-lg"
                />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Mask Image</h3>
                <img
                  src={pair.mask_url}
                  alt="Mask"
                  className="w-full h-auto rounded-lg"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
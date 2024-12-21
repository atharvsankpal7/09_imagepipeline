import { Link } from 'react-router-dom';
import { Brush, Image } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Brush className="h-6 w-6 text-indigo-600" />
            <span className="text-xl font-bold text-gray-800">Image Inpainting</span>
          </Link>
          <div className="flex space-x-4">
            <Link
              to="/"
              className="flex items-center px-3 py-2 rounded-md text-gray-700 hover:text-indigo-600"
            >
              Editor
            </Link>
            <Link
              to="/gallery"
              className="flex items-center px-3 py-2 rounded-md text-gray-700 hover:text-indigo-600"
            >
              <Image className="h-5 w-5 mr-1" />
              Gallery
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
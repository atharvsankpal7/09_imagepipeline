import { X } from 'lucide-react';
import { motion } from 'framer-motion';

interface PreviewModalProps {
  originalImage: string;
  maskImage: string;
  onClose: () => void;
}

const PreviewModal = ({ originalImage, maskImage, onClose }: PreviewModalProps) => {
  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: "spring", duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-4">
          <motion.h3
            className="text-lg font-semibold"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            Preview Images
          </motion.h3>
          <motion.button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="h-5 w-5" />
          </motion.button>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {[
            { title: "Original Image", src: originalImage },
            { title: "Masked Image", src: maskImage }
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <h4 className="text-sm font-medium mb-2">{item.title}</h4>
              <motion.img
                src={item.src}
                alt={item.title}
                className="w-full h-auto rounded-lg shadow-md"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PreviewModal;
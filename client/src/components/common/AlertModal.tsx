import Modal from './Modal';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type: 'success' | 'error';
}

const AlertModal = ({ isOpen, onClose, title, message, type }: AlertModalProps) => {
  const Icon = type === 'success' ? CheckCircle : AlertCircle;
  const colorClass = type === 'success' ? 'text-green-500' : 'text-red-500';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="flex flex-col items-center text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.5 }}
        >
          <Icon className={`h-12 w-12 ${colorClass} mb-4`} />
        </motion.div>
        <p className="text-gray-600">{message}</p>
        <motion.button
          className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          onClick={onClose}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Close
        </motion.button>
      </div>
    </Modal>
  );
}

export default AlertModal;
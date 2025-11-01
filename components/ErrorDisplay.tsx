import { AlertCircle, X } from 'lucide-react';

interface ErrorDisplayProps {
  message: string;
  onDismiss: () => void;
}

export default function ErrorDisplay({ message, onDismiss }: ErrorDisplayProps) {
  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-red-800 font-semibold">Error</h3>
            <p className="text-red-700 text-sm mt-1">{message}</p>
          </div>
        </div>
        <button
          onClick={onDismiss}
          className="text-red-500 hover:text-red-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

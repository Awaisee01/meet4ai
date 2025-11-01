interface ModeToggleProps {
  mode: 'form' | 'json';
  onModeChange: (mode: 'form' | 'json') => void;
}

export default function ModeToggle({ mode, onModeChange }: ModeToggleProps) {
  return (
    <div className="flex justify-center mb-8">
      <div className="inline-flex rounded-lg border border-purple-200 bg-purple-50 p-1">
        <button
          onClick={() => onModeChange('form')}
          className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
            mode === 'form'
              ? 'bg-purple-800 text-white shadow-md'
              : 'text-purple-800 hover:bg-purple-100'
          }`}
        >
          Form Mode
        </button>
        <button
          onClick={() => onModeChange('json')}
          className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
            mode === 'json'
              ? 'bg-purple-800 text-white shadow-md'
              : 'text-purple-800 hover:bg-purple-100'
          }`}
        >
          JSON Mode
        </button>
      </div>
    </div>
  );
}

export default function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-800 rounded-full animate-spin"></div>
      </div>
      <p className="mt-4 text-purple-900 font-medium">Analyzing your data...</p>
      <p className="mt-2 text-gray-600 text-sm">
        Our AI is finding the best meeting times
      </p>
    </div>
  );
}

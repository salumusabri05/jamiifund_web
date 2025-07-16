export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-full w-full py-8">
      <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

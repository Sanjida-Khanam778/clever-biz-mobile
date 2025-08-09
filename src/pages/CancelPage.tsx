export default function CancelPage() {
  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold text-red-600">Payment Canceled</h1>
      <a
        href="/"
        className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded"
      >
        Try Again
      </a>
    </div>
  );
}

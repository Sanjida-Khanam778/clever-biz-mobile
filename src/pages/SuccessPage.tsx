import { useSearchParams } from "react-router";

export default function SuccessPage() {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");

  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold text-green-600">Payment Successful!</h1>
      {sessionId && (
        <p className="mt-2 text-gray-700">
          Your payment session ID: {sessionId}
        </p>
      )}
      <a
        href="/"
        className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded"
      >
        Back to Orders
      </a>
    </div>
  );
}

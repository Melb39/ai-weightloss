import { useState } from "react";

export default function Home() {
  const [goal, setGoal] = useState("");
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPlan("");

    try {
      const res = await fetch("http://localhost:5000/generate-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ goal }),
      });

      const data = await res.json();
      setPlan(data.plan);
    } catch (err) {
      console.error(err);
      setPlan("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    const res = await fetch("http://localhost:5000/create-checkout-session", {
      method: "POST",
    });

    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert("Something went wrong with payment.");
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-blue-600 mb-8">
        AI Weight Loss Plan
      </h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-4 w-full max-w-xl"
      >
        <input
          type="text"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="Enter your weight loss goal..."
          className="flex-1 p-4 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-4 rounded-lg hover:bg-blue-700 transition"
        >
          Generate Plan
        </button>
      </form>

      <button
        onClick={handlePayment}
        className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 mt-6"
      >
        Pay $4.99 to Unlock Full Plan
      </button>

      {loading && (
        <p className="mt-6 text-gray-600 animate-pulse">
          Generating your plan...
        </p>
      )}

      {plan && (
        <div className="mt-8 bg-white p-6 rounded-xl shadow-md max-w-xl w-full text-gray-800">
          <h2 className="text-2xl font-semibold mb-4">Your AI Plan</h2>
          <p>{plan}</p>
        </div>
      )}
    </main>
  );
}

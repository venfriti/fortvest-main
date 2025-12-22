export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900">Welcome to your Dashboard</h1>
        <p className="mt-4 text-gray-600">You have successfully logged in!</p>
        
        {/* We will build the real dashboard here later */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="font-semibold text-gray-500">Total Balance</h3>
            <p className="text-3xl font-bold mt-2">₦0.00</p>
          </div>
        </div>
      </div>
    </div>
  );
}
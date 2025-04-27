import { useEffect, useState } from 'react';

const AdminWelcomePage = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBooks: 0,
    activeUsers: 0,
    recentActivity: []
  });

  useEffect(() => {
    // TODO: Fetch admin dashboard statistics
    // This will be implemented when we connect to the backend
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Total Users</h3>
          <p className="text-3xl font-bold">{stats.totalUsers}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Total Books</h3>
          <p className="text-3xl font-bold">{stats.totalBooks}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Active Users</h3>
          <p className="text-3xl font-bold">{stats.activeUsers}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        {stats.recentActivity.length === 0 ? (
          <p className="text-gray-500">No recent activity</p>
        ) : (
          <ul className="space-y-4">
            {stats.recentActivity.map((activity, index) => (
              <li key={index} className="border-b pb-2">
                {activity}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminWelcomePage;

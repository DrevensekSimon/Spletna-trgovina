import React, { useState, useEffect } from 'react';
import StoreStatistics from '../components/StoreStatistics';

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // Simulirani API klic
      setTimeout(() => {
        setDashboardData({
          lastUpdated: new Date().toLocaleString(),
          systemHealth: 'Excellent',
          uptime: '99.9%',
        });
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome to your store analytics</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Last updated: {dashboardData?.lastUpdated || 'Loading...'}</p>
              <p className="text-sm font-semibold text-green-600">System Status: {dashboardData?.systemHealth || 'Loading...'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition ${
                activeTab === 'overview'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition ${
                activeTab === 'analytics'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              Analytics
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition ${
                activeTab === 'reports'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              Reports
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="py-8">
        {activeTab === 'overview' && (
          <div className="max-w-7xl mx-auto px-4">
            <StoreStatistics />
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="max-w-7xl mx-auto px-4">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Detailed Analytics</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="border rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Customer Insights</h3>
                  <ul className="space-y-3">
                    <li className="flex justify-between">
                      <span className="text-gray-600">Total Customers</span>
                      <span className="font-bold text-gray-900">2,847</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">New Customers (This Month)</span>
                      <span className="font-bold text-gray-900">342</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Returning Customers</span>
                      <span className="font-bold text-gray-900">1,923</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Customer Retention Rate</span>
                      <span className="font-bold text-green-600">67.5%</span>
                    </li>
                  </ul>
                </div>

                <div className="border rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Product Performance</h3>
                  <ul className="space-y-3">
                    <li className="flex justify-between">
                      <span className="text-gray-600">Total Products</span>
                      <span className="font-bold text-gray-900">156</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Out of Stock</span>
                      <span className="font-bold text-red-600">12</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Low Stock</span>
                      <span className="font-bold text-yellow-600">28</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Best Seller</span>
                      <span className="font-bold text-gray-900">Air Jordan 1</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 border rounded-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Traffic Sources</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Direct</span>
                      <span className="font-bold text-gray-900">35%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: '35%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Organic Search</span>
                      <span className="font-bold text-gray-900">42%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '42%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Social Media</span>
                      <span className="font-bold text-gray-900">18%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '18%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Referral</span>
                      <span className="font-bold text-gray-900">5%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '5%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="max-w-7xl mx-auto px-4">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Reports</h2>
              
              <div className="space-y-4">
                <div className="border rounded-lg p-4 hover:shadow-md transition cursor-pointer">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-gray-900">Monthly Sales Report</h3>
                      <p className="text-sm text-gray-600">Generated on May 18, 2026</p>
                    </div>
                    <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition">
                      Download
                    </button>
                  </div>
                </div>

                <div className="border rounded-lg p-4 hover:shadow-md transition cursor-pointer">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-gray-900">Customer Analysis Report</h3>
                      <p className="text-sm text-gray-600">Generated on May 17, 2026</p>
                    </div>
                    <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition">
                      Download
                    </button>
                  </div>
                </div>

                <div className="border rounded-lg p-4 hover:shadow-md transition cursor-pointer">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-gray-900">Inventory Status Report</h3>
                      <p className="text-sm text-gray-600">Generated on May 16, 2026</p>
                    </div>
                    <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition">
                      Download
                    </button>
                  </div>
                </div>

                <div className="border rounded-lg p-4 hover:shadow-md transition cursor-pointer">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-gray-900">Traffic & Conversion Report</h3>
                      <p className="text-sm text-gray-600">Generated on May 15, 2026</p>
                    </div>
                    <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition">
                      Download
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;

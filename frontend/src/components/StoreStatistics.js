import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const StoreStatistics = () => {
  const [salesData, setSalesData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyTrend, setMonthlyTrend] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    topProduct: '',
  });

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      
      // Simulirani podatki za demonstracijo
      const mockSalesData = [
        { name: 'Jan', sales: 4000, orders: 24 },
        { name: 'Feb', sales: 3000, orders: 13 },
        { name: 'Mar', sales: 2000, orders: 9 },
        { name: 'Apr', sales: 2780, orders: 39 },
        { name: 'May', sales: 1890, orders: 22 },
        { name: 'Jun', sales: 2390, orders: 22 },
      ];

      const mockCategoryData = [
        { name: 'Air Jordan 1', value: 35 },
        { name: 'Air Jordan 11', value: 25 },
        { name: 'Air Jordan 3', value: 20 },
        { name: 'Air Jordan 5', value: 15 },
        { name: 'Other', value: 5 },
      ];

      const mockMonthlyTrend = [
        { month: 'Week 1', revenue: 1200, customers: 45 },
        { month: 'Week 2', revenue: 1500, customers: 52 },
        { month: 'Week 3', revenue: 1800, customers: 61 },
        { month: 'Week 4', revenue: 2100, customers: 73 },
        { month: 'Week 5', revenue: 1900, customers: 68 },
      ];

      setSalesData(mockSalesData);
      setCategoryData(mockCategoryData);
      setMonthlyTrend(mockMonthlyTrend);
      
      setStats({
        totalSales: 15060,
        totalOrders: 129,
        averageOrderValue: 116.74,
        topProduct: 'Air Jordan 1 Retro High OG',
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching statistics:', error);
      setLoading(false);
    }
  };

  const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6'];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12">Store Statistics & Analytics</h1>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
            <div className="text-gray-600 text-sm font-semibold uppercase">Total Sales</div>
            <div className="text-3xl font-bold text-gray-900 mt-2">${stats.totalSales.toLocaleString()}</div>
            <div className="text-green-600 text-sm mt-2">↑ 12% from last month</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
            <div className="text-gray-600 text-sm font-semibold uppercase">Total Orders</div>
            <div className="text-3xl font-bold text-gray-900 mt-2">{stats.totalOrders}</div>
            <div className="text-green-600 text-sm mt-2">↑ 8% from last month</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
            <div className="text-gray-600 text-sm font-semibold uppercase">Avg Order Value</div>
            <div className="text-3xl font-bold text-gray-900 mt-2">${stats.averageOrderValue.toFixed(2)}</div>
            <div className="text-green-600 text-sm mt-2">↑ 5% from last month</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
            <div className="text-gray-600 text-sm font-semibold uppercase">Top Product</div>
            <div className="text-lg font-bold text-gray-900 mt-2">{stats.topProduct}</div>
            <div className="text-gray-600 text-sm mt-2">245 units sold</div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Sales & Orders Chart */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Monthly Sales & Orders</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" fill="#ef4444" name="Sales ($)" />
                <Bar dataKey="orders" fill="#3b82f6" name="Orders" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Category Distribution */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Sales by Category</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Trend */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Weekly Revenue & Customer Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#ef4444" name="Revenue ($)" strokeWidth={2} />
              <Line yAxisId="right" type="monotone" dataKey="customers" stroke="#3b82f6" name="Customers" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Performance Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-lg">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Best Performing Month</h3>
            <p className="text-2xl font-bold text-red-600">April</p>
            <p className="text-gray-600 text-sm mt-2">$2,780 in sales with 39 orders</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Customer Satisfaction</h3>
            <p className="text-2xl font-bold text-blue-600">4.8/5.0</p>
            <p className="text-gray-600 text-sm mt-2">Based on 1,247 reviews</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Conversion Rate</h3>
            <p className="text-2xl font-bold text-green-600">3.24%</p>
            <p className="text-gray-600 text-sm mt-2">↑ 0.5% from last period</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-lg shadow-md mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-4 border-b">
              <div>
                <p className="font-semibold text-gray-900">New Order #12847</p>
                <p className="text-sm text-gray-600">Customer: John Doe</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">$245.99</p>
                <p className="text-sm text-green-600">2 minutes ago</p>
              </div>
            </div>

            <div className="flex items-center justify-between pb-4 border-b">
              <div>
                <p className="font-semibold text-gray-900">New Order #12846</p>
                <p className="text-sm text-gray-600">Customer: Jane Smith</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">$189.50</p>
                <p className="text-sm text-green-600">15 minutes ago</p>
              </div>
            </div>

            <div className="flex items-center justify-between pb-4 border-b">
              <div>
                <p className="font-semibold text-gray-900">New Order #12845</p>
                <p className="text-sm text-gray-600">Customer: Mike Johnson</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">$312.75</p>
                <p className="text-sm text-green-600">32 minutes ago</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">New Order #12844</p>
                <p className="text-sm text-gray-600">Customer: Sarah Williams</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">$156.25</p>
                <p className="text-sm text-green-600">1 hour ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreStatistics;

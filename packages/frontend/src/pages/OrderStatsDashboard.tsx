import axios from 'axios';
import type React from 'react';
import { useEffect, useState } from 'react';
import { LoadingComponent } from '../components/LoadingComponent';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';

interface SeatTypeStats {
  total: number;
  available: number;
  sold: number;
}

interface DateStats {
  date: string;
  orders: {
    totalSoldPrice: number;
    totalOrders: number;
    totalSeatsOrdered: number;
  };
  seats: {
    total: number;
    available: number;
    sold: number;
    seatTypes: Record<string, SeatTypeStats>;
  };
}

interface EnhancedStats {
  overall: {
    totalSoldPrice: number;
    totalOrders: number;
    totalSeatsOrdered: number;
  };
  byDate: DateStats[];
}

const StatCard: React.FC<{
  title: string;
  value: string | number;
  subtitle?: string;
  className?: string;
}> = ({ title, value, subtitle, className = '' }) => (
  <div className={`bg-gray-800 rounded-lg p-6 ${className}`}>
    <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wide">
      {title}
    </h3>
    <p className="text-white text-3xl font-bold mt-2">{value}</p>
    {subtitle && <p className="text-gray-500 text-sm mt-1">{subtitle}</p>}
  </div>
);

const ProgressBar: React.FC<{
  label: string;
  current: number;
  total: number;
  color?: string;
}> = ({ label, current, total, color = 'bg-blue-500' }) => {
  const percentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm text-gray-300 mb-1">
        <span>{label}</span>
        <span>
          {current} / {total}
        </span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div
          className={`${color} h-2 rounded-full transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="text-xs text-gray-500 mt-1">{percentage.toFixed(1)}%</div>
    </div>
  );
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-NZ', {
    style: 'currency',
    currency: 'NZD',
  }).format(amount);
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-NZ', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const OrderStatsDashboard: React.FC = () => {
  const [stats, setStats] = useState<EnhancedStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get<EnhancedStats>(
          `${API_BASE_URL}/api/v1/orders/stats`,
          { withCredentials: true },
        );
        setStats(response.data);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
        setError('Failed to load statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070507] flex items-center justify-center">
        <LoadingComponent />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen bg-[#070507] flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Error Loading Dashboard</h1>
          <p className="text-gray-400">{error || 'No data available'}</p>
        </div>
      </div>
    );
  }

  const totalSeatsAcrossAllDates = stats.byDate.reduce(
    (sum, date) => sum + date.seats.total,
    0,
  );
  const totalSoldSeatsAcrossAllDates = stats.byDate.reduce(
    (sum, date) => sum + date.seats.sold,
    0,
  );

  return (
    <div className="min-h-screen bg-[#070507] text-white">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#e5ce63] mb-2">
            Order Statistics Dashboard
          </h1>
          <p className="text-gray-400">
            Real-time insights into MedRevue 2025 ticket sales and seat
            availability
          </p>
        </div>

        {/* Overall Statistics */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-[#e5ce63]">
            Overall Performance
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              title="Total Revenue"
              value={formatCurrency(stats.overall.totalSoldPrice)}
              subtitle="From all shows"
              className="border-l-4 border-green-500"
            />
            <StatCard
              title="Total Orders"
              value={stats.overall.totalOrders}
              subtitle="Completed purchases"
              className="border-l-4 border-blue-500"
            />
            <StatCard
              title="Seats Sold"
              value={stats.overall.totalSeatsOrdered}
              subtitle={`${totalSoldSeatsAcrossAllDates} of ${totalSeatsAcrossAllDates} total seats`}
              className="border-l-4 border-purple-500"
            />
          </div>
        </div>

        {/* Overall Seat Availability */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-[#e5ce63]">
            Overall Seat Availability
          </h2>
          <div className="bg-gray-800 rounded-lg p-6">
            <ProgressBar
              label="Total Seats Sold"
              current={totalSoldSeatsAcrossAllDates}
              total={totalSeatsAcrossAllDates}
              color="bg-green-500"
            />
          </div>
        </div>

        {/* Per-Date Statistics */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-[#e5ce63]">
            Show Performance by Date
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {stats.byDate.map((dateStats) => (
              <div
                key={dateStats.date}
                className="bg-gray-800 rounded-lg p-6 border border-gray-700"
              >
                <h3 className="text-xl font-semibold mb-4 text-[#e5ce63]">
                  {formatDate(dateStats.date)}
                </h3>

                {/* Order Stats */}
                <div className="mb-6">
                  <h4 className="text-lg font-medium mb-3 text-gray-300">
                    Sales Performance
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Revenue:</span>
                      <span className="font-semibold text-green-400">
                        {formatCurrency(dateStats.orders.totalSoldPrice)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Orders:</span>
                      <span className="font-semibold">
                        {dateStats.orders.totalOrders}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Seats Ordered:</span>
                      <span className="font-semibold">
                        {dateStats.orders.totalSeatsOrdered}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Seat Availability */}
                <div className="mb-6">
                  <h4 className="text-lg font-medium mb-3 text-gray-300">
                    Seat Availability
                  </h4>
                  <ProgressBar
                    label="Seats Sold"
                    current={dateStats.seats.sold}
                    total={dateStats.seats.total}
                    color="bg-red-500"
                  />
                </div>

                {/* Seat Types */}
                <div>
                  <h4 className="text-lg font-medium mb-3 text-gray-300">
                    Seat Types
                  </h4>
                  {Object.entries(dateStats.seats.seatTypes).map(
                    ([type, typeStats]) => (
                      <div key={type} className="mb-3">
                        <ProgressBar
                          label={`${type} Seats`}
                          current={typeStats.sold}
                          total={typeStats.total}
                          color={
                            type === 'VIP' ? 'bg-yellow-500' : 'bg-blue-500'
                          }
                        />
                      </div>
                    ),
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Insights */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-[#e5ce63]">
            Key Insights
          </h2>
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-3">
                  Best Performing Show
                </h3>
                {(() => {
                  const bestShow = stats.byDate.reduce((best, current) =>
                    current.orders.totalSoldPrice > best.orders.totalSoldPrice
                      ? current
                      : best,
                  );
                  return (
                    <p className="text-gray-300">
                      {formatDate(bestShow.date)} with{' '}
                      <span className="text-green-400 font-semibold">
                        {formatCurrency(bestShow.orders.totalSoldPrice)}
                      </span>{' '}
                      in revenue
                    </p>
                  );
                })()}
              </div>
              <div>
                <h3 className="text-lg font-medium mb-3">
                  Average Order Value
                </h3>
                <p className="text-gray-300">
                  <span className="text-blue-400 font-semibold">
                    {formatCurrency(
                      stats.overall.totalOrders > 0
                        ? stats.overall.totalSoldPrice /
                            stats.overall.totalOrders
                        : 0,
                    )}
                  </span>{' '}
                  per order
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderStatsDashboard;

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import {
  Users,
  MessageSquare,
  Search
} from 'lucide-react';

type TabType = 'users' | 'feedback';

export default function AdminPanel() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('users');
  const [users, setUsers] = useState<any[]>([]);
  const [feedback, setFeedback] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    checkAdminStatus();
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin, activeTab]);

  const checkAdminStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      setIsAdmin(data?.is_admin || false);

      if (!data?.is_admin) {
        navigate('/home');
        toast.error('Unauthorized access');
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      navigate('/home');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      switch (activeTab) {
        case 'users':
          const { data: usersData } = await supabase
            .from('user_profiles')
            .select('*')
            .order('created_at', { ascending: false });
          setUsers(usersData || []);
          break;

        case 'feedback':
          const { data: feedbackData } = await supabase
            .from('feedback')
            .select(`
              *,
              user_profiles:user_profiles(first_name, last_name)
            `)
            .order('created_at', { ascending: false });
          setFeedback(feedbackData || []);
          break;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('users')}
              className={`flex items-center px-6 py-3 ${
                activeTab === 'users'
                  ? 'border-b-2 border-green-500 text-green-600'
                  : 'text-gray-600'
              }`}
            >
              <Users className="h-5 w-5 mr-2" />
              Users
            </button>
            <button
              onClick={() => setActiveTab('feedback')}
              className={`flex items-center px-6 py-3 ${
                activeTab === 'feedback'
                  ? 'border-b-2 border-green-500 text-green-600'
                  : 'text-gray-600'
              }`}
            >
              <MessageSquare className="h-5 w-5 mr-2" />
              Feedback
            </button>
          </div>

          {/* Search */}
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading...</p>
              </div>
            ) : (
              <div>
                {activeTab === 'users' && (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Contact
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Location
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Joined
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => (
                          <tr key={user.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {user.first_name} {user.last_name}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">
                                {user.phone}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">
                                {user.city}, {user.state}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(user.created_at).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {activeTab === 'feedback' && (
                  <div className="space-y-6">
                    {feedback.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white rounded-lg shadow p-6"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div>
                              <h3 className="text-lg font-semibold">
                                {item.user_profiles?.first_name}{' '}
                                {item.user_profiles?.last_name}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {new Date(item.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            {Array.from({ length: item.rating }).map((_, i) => (
                              <svg
                                key={i}
                                className="h-5 w-5 text-yellow-400"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                        <p className="mt-4 text-gray-600">{item.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
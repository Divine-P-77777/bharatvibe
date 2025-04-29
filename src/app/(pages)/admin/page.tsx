'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';
import dynamic from 'next/dynamic';
import { Shield, UserX, CheckCircle, AlertTriangle, Users } from 'lucide-react';

// Dynamically import heavy components
const AdminUsersList = dynamic(() => import('./AdminUsersList'), {
  ssr: false,
  loading: () => <div className="p-12 text-center">Loading users management...</div>
});

const AdminPosts = dynamic(() => import('./AdminPosts'), {
  ssr: false,
  loading: () => <div className="p-12 text-center">Loading posts management...</div>
});

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL!;

export default function AdminPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        router.push('/auth');
        return;
      }
  
      try {
        // Use the RPC function instead of direct table access
        const { data: isAdmin, error } = await supabase.rpc('is_admin');
        
        if (error) throw error;
        setIsAdmin(isAdmin);
        
        if (!isAdmin) {
          router.push('/');
        }
      } catch (error) {
        console.error('Admin check error:', error);
        router.push('/');
      } finally {
        setLoading(false);
      }
    };
  
    checkAdminStatus();
  }, [user, router]); 

  const addAdminEmail = async (email: string) => {
    if (!isAdmin) return;
  
    try {
      const { error } = await supabase
        .from('admins')
        .insert([{ 
          email, 
          added_by: user?.email,
          added_at: new Date().toISOString()
        }]);
  
      if (error) throw error;
  
      // Log the action
      await supabase
        .from('admin_audit_log')
        .insert({
          action: 'ADD_ADMIN',
          performer: user?.email,
          target_email: email,
          timestamp: new Date().toISOString()
        });
  
      toast.success(`${email} added as an admin successfully`);
    } catch (error: any) {
      toast.error(`Failed to add admin: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-bharat-orange"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-red-50 p-6 rounded-lg shadow-lg text-center">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-red-700 mb-2">Access Denied</h1>
          <p className="text-gray-700 mb-4">
            You do not have permission to access the admin dashboard.
            Please contact the system administrator if you believe this is an error.
          </p>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            onClick={() => router.push('/')}
          >
            Return to Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <Shield className="mr-2 h-8 w-8 text-bharat-orange" /> Admin Dashboard
          </h1>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Exit Admin
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Admin tabs */}
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg mb-6">
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              className={`px-6 py-4 flex items-center ${activeTab === 'users'
                ? 'border-b-2 border-bharat-orange text-bharat-orange'
                : 'text-gray-500 dark:text-gray-400'}`}
              onClick={() => setActiveTab('users')}
            >
              <Users className="h-5 w-5 mr-2" />
              Users Management
            </button>
            <button
              className={`px-6 py-4 flex items-center ${activeTab === 'posts'
                ? 'border-b-2 border-bharat-orange text-bharat-orange'
                : 'text-gray-500 dark:text-gray-400'}`}
              onClick={() => setActiveTab('posts')}
            >
              <CheckCircle className="h-5 w-5 mr-2" />
              Content Moderation
            </button>
            <button
              className={`px-6 py-4 flex items-center ${activeTab === 'admins'
                ? 'border-b-2 border-bharat-orange text-bharat-orange'
                : 'text-gray-500 dark:text-gray-400'}`}
              onClick={() => setActiveTab('admins')}
            >
              <Shield className="h-5 w-5 mr-2" />
              Admins
            </button>
          </div>
        </div>

        {/* Tab content */}
        <div className="bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg p-6">
          {activeTab === 'users' && <AdminUsersList />}
          {activeTab === 'posts' && <AdminPosts />}
          {activeTab === 'admins' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Manage Admin Access</h2>
              <form
                className="mb-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const email = formData.get('email') as string;
                  if (email) {
                    addAdminEmail(email);
                    (e.target as HTMLFormElement).reset();
                  }
                }}
              >
                <div className="flex gap-2">
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter email to add as admin"
                    className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                    required
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-bharat-orange text-white rounded-md hover:bg-orange-600"
                  >
                    Add Admin
                  </button>
                </div>
              </form>
              <AdminAdminsList currentUserEmail={user?.email} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AdminAdminsList({ currentUserEmail }: { currentUserEmail?: string }) {
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const { data, error } = await supabase
          .from('admins')
          .select('*')
          .order('created_at', { ascending: false });
    
        if (error) throw error;
        setAdmins(data || []);
      } catch (error) {
        console.error('Error fetching admins:', error);
        toast.error('Failed to load admin users');
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  const removeAdmin = async (email: string) => {
    // Don't allow removing yourself
    if (email === currentUserEmail) {
      toast.error('You cannot remove yourself as an admin');
      return;
    }

    // Don't allow removing the primary admin
    if (email === ADMIN_EMAIL) {
      toast.error('Cannot remove the primary admin');
      return;
    }

    try {
      const { error } = await supabase
        .from('admins')
        .delete()
        .eq('email', email);

      if (error) throw error;

      setAdmins(admins.filter(admin => admin.email !== email));
      toast.success(`${email} removed from admins`);
    } catch (error: any) {
      toast.error(`Failed to remove admin: ${error.message}`);
    }
  };

  if (loading) {
    return <p>Loading admin list...</p>;
  }

  return (
    <div>
      <h3 className="text-lg font-medium mb-2">Current Admins</h3>
      <div className="bg-gray-50 dark:bg-gray-900 rounded-md">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {admins.map((admin) => (
            <li key={admin.id} className="py-3 px-4 flex justify-between items-center">
              <div>
                <p className="font-medium">{admin.email}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Added by: {admin.added_by || 'system'}
                  {admin.email === ADMIN_EMAIL && ' • Primary Admin'}
                  {admin.email === currentUserEmail && ' • You'}
                </p>
              </div>
              {admin.email !== ADMIN_EMAIL && (
                <button
                  onClick={() => removeAdmin(admin.email)}
                  className="p-1 text-red-500 hover:text-red-700"
                  disabled={admin.email === currentUserEmail}
                >
                  <UserX className="h-5 w-5" />
                </button>
              )}
            </li>
          ))}
          {admins.length === 0 && (
            <li className="py-3 px-4 text-gray-500 dark:text-gray-400">No admins found</li>
          )}
        </ul>
      </div>
    </div>
  );
}
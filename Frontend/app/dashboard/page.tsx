"use client";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { logoutUser } from "@/lib/features/auth/authSlice";
export default function DashboardPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);
  const handleLogout = async () => {
    await dispatch(logoutUser());
    router.push("/login");
  };
  if (!isAuthenticated) {
    return null;
  }
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Job Tracker
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-gray-700 dark:text-gray-300">
                {user?.name}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="text-center py-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Welcome to Your Dashboard, {user?.name}!
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start tracking your job applications here.
            </p>
            <a
              href="/tracker"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Go to Job Tracker
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}

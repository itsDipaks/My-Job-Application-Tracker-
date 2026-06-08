import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 font-sans px-4">
      <main className="flex flex-1 w-full max-w-5xl flex-col items-center justify-center py-16 px-4">
        <div className="text-center space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white">
          Application Tracker
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Keep track of all your job applications in one place. 
            Organize, monitor, and manage your job search efficiently.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
            <Link
              href="/signup"
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition duration-200 shadow-lg hover:shadow-xl"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-semibold rounded-lg transition duration-200 border border-gray-300 dark:border-gray-600 shadow-lg hover:shadow-xl"
            >
              Sign In
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
              <div className="text-indigo-600 dark:text-indigo-400 text-3xl mb-4">📋</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Track Applications
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Keep all your job applications organized in one dashboard
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
              <div className="text-indigo-600 dark:text-indigo-400 text-3xl mb-4">📊</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Monitor Progress
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Track the status of each application from start to finish
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
              <div className="text-indigo-600 dark:text-indigo-400 text-3xl mb-4">🎯</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Stay Organized
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Never miss a deadline or follow-up with smart reminders
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

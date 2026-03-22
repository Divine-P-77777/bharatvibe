import React from 'react';
import { ServerCrash } from 'lucide-react';
import Link from 'next/link';

const ServerDown = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 text-center p-4">
      <div className="bg-white dark:bg-gray-800 p-8 md:p-12 rounded-3xl shadow-xl flex flex-col items-center max-w-lg w-full border border-gray-100 dark:border-gray-700">
        <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-full mb-6">
          <ServerCrash className="h-16 w-16 text-red-500 animate-pulse" />
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Server Temporarily Down
        </h1>
        
        <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-sm mb-8 leading-relaxed">
          Our database is currently paused or experiencing high traffic. 
          The administrative team has been notified and we are working to bring it back online shortly.
        </p>
        
        <Link 
          href="/" 
          className="px-8 py-3.5 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-full font-semibold hover:shadow-lg hover:opacity-90 transition-all active:scale-95"
          onClick={() => window.location.href = '/'}
        >
          Check Again
        </Link>
      </div>
    </div>
  );
};

export default ServerDown;

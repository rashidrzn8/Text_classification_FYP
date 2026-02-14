import { useEffect, useState } from 'react';
import ClassificationForm from './components/ClassificationForm';
import { checkHealth } from './services/api';

function App() {
  const [serverStatus, setServerStatus] = useState('checking');

  useEffect(() => {
    checkHealth().then(data => {
      setServerStatus(data.status === 'healthy' || data.status === 'degraded' ? 'online' : 'offline');
    }).catch(() => setServerStatus('offline'));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-600">
                AI Classifier
              </span>
            </div>
            <div className="flex items-center">
              <div className="flex items-center space-x-2 text-sm">
                <span className={`h-2.5 w-2.5 rounded-full ${serverStatus === 'online' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                <span className="text-gray-600 font-medium">
                  Server: {serverStatus === 'checking' ? 'Checking...' : (serverStatus === 'online' ? 'Online' : 'Offline')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-10">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
              Headline Text <span className="text-primary">Classifier</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Leverage the power of our advanced neural network to classify your text in seconds.
            </p>
          </div>
          
          <ClassificationForm />
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} Advanced Text Classification System. Built with React & Flask.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;

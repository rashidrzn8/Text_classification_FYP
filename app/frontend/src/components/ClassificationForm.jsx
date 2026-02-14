import { useState } from 'react';
import { classifyText } from '../services/api';

const ClassificationForm = () => {
    const [input, setInput] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        setLoading(true);
        setError('');
        setResult(null);

        try {
            const data = await classifyText(input);
            setResult(data);
        } catch (err) {
            setError(err.message || "Failed to classify text");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Text Classifier</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="text-input" className="block text-sm font-medium text-gray-700 mb-2">
                        Enter your text
                    </label>
                    <textarea
                        id="text-input"
                        rows="5"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none text-gray-700 placeholder-gray-400"
                        placeholder="Type or paste text here to classify..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={loading}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading || !input.trim()}
                    className={`w-full py-3 px-6 text-white font-semibold rounded-lg shadow-md transition-all transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary
                        ${loading || !input.trim() 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-primary to-indigo-600 hover:from-indigo-600 hover:to-indigo-700'
                        }`}
                >
                    {loading ? (
                        <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Analyzing...
                        </span>
                    ) : 'Classify Text'}
                </button>
            </form>

            {error && (
                <div className="mt-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 flex items-start animate-fade-in">
                    <svg className="w-5 h-5 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>{error}</span>
                </div>
            )}

            {result && (
                <div className="mt-8 pt-6 border-t border-gray-100 animate-fade-in">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Analysis Result</h3>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-emerald-100 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mt-2 -mr-2 w-24 h-24 bg-green-200 rounded-full opacity-20 filter blur-xl"></div>
                        
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-emerald-600 uppercase tracking-wider">Predicted Category</span>
                                {result.details && result.details.confidence && (
                                    <span className="text-sm font-bold text-emerald-700 bg-emerald-200 px-2 py-1 rounded">
                                        {(result.details.confidence * 100).toFixed(1)}% Confidence
                                    </span>
                                )}
                            </div>
                            <div className="text-3xl font-bold text-gray-800 tracking-tight">
                                {result.message}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClassificationForm;

import React, { useState, useEffect } from "react";

import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function App() {
  const [code1, setCode1] = useState("");
  const [code2, setCode2] = useState("");
  const [language, setLanguage] = useState("Python");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [supportedLanguages, setSupportedLanguages] = useState([]);

  useEffect(() => {
    fetchLanguages();
  }, []);

  const fetchLanguages = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/languages`);
      setSupportedLanguages(response.data.languages);
    } catch (err) {
      console.log("Backend not available, using default languages");
      setSupportedLanguages([
        { name: "Python"},
        { name: "Java"},
        { name: "C++" },
        { name: "JavaScript" },
      ]);
    }
  };

  const handleCompare = async (e) => {
    e.preventDefault();

    if (!code1.trim()) {
      setError("Please paste code in the first section");
      return;
    }

    if (!code2.trim()) {
      setError("Please paste code in the second section");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(`${API_URL}/api/compare`, {
        code1: code1,
        code2: code2,
        language: language.toLowerCase(),
      });

      setResult(response.data);
    } catch (err) {
      const errorMsg =
        err.response?.data?.error ||
        "Error comparing code. Make sure backend is running on localhost:5000";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setCode1("");
    setCode2("");
    setResult(null);
    setError("");
  };

  const getSimilarityColor = (similarity) => {
    if (similarity >= 80) return "text-red-600";
    if (similarity >= 50) return "text-amber-600";
    return "text-green-600";
  };

  const getResultBackground = (riskLevel) => {
    if (riskLevel === "HIGH") return "bg-red-50 border-red-200";
    if (riskLevel === "MEDIUM") return "bg-amber-50 border-amber-200";
    return "bg-green-50 border-green-200";
  };

  return (
    <div className="min-h-screen bg-zinc-100 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-semibold text-zinc-900">
            Code Similarity Checker
          </h1>
          <p className="text-zinc-500 mt-2">
            Compare two code snippets and detect structural similarities.
          </p>
        </div>

        <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden">
          <div className="p-8">
            <form onSubmit={handleCompare} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Programming Language
                </label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {supportedLanguages.length > 0 ? (
                    supportedLanguages.map((lang) => (
                      <button
                        key={lang.name}
                        type="button"
                        onClick={() => setLanguage(lang.name)}
                        className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
                          language === lang.name
                            ? "bg-zinc-900 text-white border-zinc-900"
                            : "bg-white text-zinc-700 border-zinc-300 hover:bg-zinc-100"
                        }`}
                      >
                        {lang.name}
                      </button>
                    ))
                  ) : (
                    <p className="text-gray-500 col-span-full">
                      Loading languages...
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Code Snippet A
                  </label>
                  <textarea
                    value={code1}
                    onChange={(e) => setCode1(e.target.value)}
                    placeholder="Paste your first code here..."
                    className="
                      h-80
                      bg-zinc-900
                      text-zinc-100
                      font-mono
                      text-sm
                      p-4
                      rounded-xl
                      border
                      border-zinc-700
                      focus:outline-none
                      focus:ring-2
                      focus:ring-zinc-600
                      resize-none
                    "
                  />
                  <p className="text-xs text-zinc-500 mt-2">
                    {code1.length} characters
                  </p>
                </div>

                <div className="flex flex-col">
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Code Snippet B
                  </label>
                  <textarea
                    value={code2}
                    onChange={(e) => setCode2(e.target.value)}
                    placeholder="Paste your second code here..."
                    className="
                      h-80
                      bg-zinc-900
                      text-zinc-100
                      font-mono
                      text-sm
                      p-4
                      rounded-xl
                      border
                      border-zinc-700
                      focus:outline-none
                      focus:ring-2
                      focus:ring-zinc-600
                      resize-none
                      "
                  />
                  <p className="text-xs text-zinc-500 mt-2">
                    {code2.length} characters
                  </p>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-white font-medium py-3 rounded-xl transition"
                >
                  {loading ? "Analyzing..." : "Compare Code"}
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="flex-1 bg-zinc-200 hover:bg-zinc-300 text-zinc-800 font-medium py-3 rounded-xl transition"
                >
                  Clear 
                </button>
              </div>
            </form>
          </div>

          {result && (
            <div className="p-8 border-t border-zinc-200">
              <div className="space-y-6">
                <div
                  className={`p-8 rounded-2xl border-2 ${getResultBackground(result.risk_level)}`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="text-center">
                      <p
                        className={`text-5xl font-bold ${getSimilarityColor(result.similarity)}`}
                      >
                        {result.similarity}%
                      </p>
                      <p className="text-zinc-500 uppercase tracking-wide text-sm mt-3">
                        Similarity
                      </p>
                    </div>

                    <div className="text-center flex flex-col justify-center">
                      <p className="text-zinc-500 uppercase tracking-wide text-sm">
                        Risk Level
                      </p>

                      <p className="text-3xl font-semibold text-zinc-900 mt-2">
                        {result.risk_level}
                      </p>
                    </div>

                    <div className="text-center flex flex-col justify-center">
                      <p className="text-zinc-500 uppercase tracking-wide text-sm">
                        Language
                      </p>

                      <p className="text-lg font-medium text-zinc-900 mt-2">
                        {result.language}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="text-sm text-zinc-500">
                  Similarity calculated using token-based Jaccard comparison.
                </div>
              </div>
            </div>
          )}

          {!result && !loading && (
            <div className="p-16 text-center ">
              <p className="text-gray-500 text-lg font-medium">
                Paste two code snippets and run a comparison.
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Supports multiple programming languages.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
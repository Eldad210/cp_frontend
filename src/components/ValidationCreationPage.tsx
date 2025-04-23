import React, { useState } from "react";

interface CheckResult {
  ok: boolean;
  message: string;
}

const RuleAuthoringStudio: React.FC = () => {
  const [description, setDescription] = useState("");
  const [draftCode, setDraftCode] = useState("");
  const [summary, setSummary] = useState("");
  const [ifcFileId, setIfcFileId] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<CheckResult[] | null>(null);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Generate draft code
  const handleGenerate = async () => {
    if (!description.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/rules/generate-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
      });
      const data = await res.json();
      setDraftCode(data.code);
      setSummary(data.summary);
      setTestResults(null);
      setFeedback("");
    } catch (err: any) {
      setError(err.message || "Failed to generate rule draft");
    } finally {
      setLoading(false);
    }
  };

  // 2. Upload IFC model
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const form = new FormData();
    form.append("file", file);
    setLoading(true);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json();
      setIfcFileId(data.id);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 3. Test draft against IFC
  const handleTest = async () => {
    if (!draftCode || !ifcFileId) return;
    setLoading(true);
    try {
      const res = await fetch("/api/rules/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: draftCode, ifcFileId }),
      });
      const data: { results: CheckResult[]; overall: boolean } = await res.json();
      setTestResults(data.results);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 4a. Approve rule
  const handleApprove = async () => {
    if (!draftCode) return;
    setLoading(true);
    try {
      await fetch("/api/rules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description, code: draftCode, summary }),
      });
      alert("Rule approved and saved!");
      setDescription("");
      setDraftCode("");
      setSummary("");
      setIfcFileId(null);
      setTestResults(null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 4b. Refine draft with feedback
  const handleRefine = async () => {
    if (!draftCode || !feedback.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/rules/refine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: draftCode, feedback }),
      });
      const data = await res.json();
      setDraftCode(data.code);
      setSummary(data.summary);
      setTestResults(null);
      setFeedback("");
    } catch (err: any) {
      setError(err.message || "Failed to refine rule");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold">Rule Authoring Studio</h2>

      {/* 1. Natural-language description */}
      <section>
        <label className="block font-medium mb-1">Rule Description</label>
        <textarea
          className="w-full border p-2 rounded"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="E.g. Flag doors with threshold below 20mm"
        />
        <button
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
          onClick={handleGenerate}
          disabled={loading || !description.trim()}
        >
          {loading ? "Generating..." : "Generate Draft"}
        </button>
        {error && <p className="text-red-600 mt-1">{error}</p>}
      </section>

      {/* 2. Draft code preview */}
      {draftCode && (
        <section>
          <label className="block font-medium mb-1">Draft Rule Code</label>
          <textarea
            className="w-full border p-2 rounded font-mono text-sm"
            rows={8}
            value={draftCode}
            readOnly
          />
          {summary && (
            <p className="italic mt-1">Preview: {summary}</p>
          )}
        </section>
      )}

      {/* 3. Upload + test */}
      {draftCode && (
        <section className="space-y-2">
          <label className="block font-medium mb-1">Upload IFC to Test</label>
          <input type="file" accept=".ifc" onChange={handleUpload} />
          <button
            className="mt-2 px-4 py-2 bg-green-600 text-white rounded"
            onClick={handleTest}
            disabled={loading || !ifcFileId}
          >
            {loading ? "Testing..." : "Run Test"}
          </button>
        </section>
      )}

      {/* 4. Test results & actions */}
      {testResults && (
        <section>
          <h3 className="text-xl font-medium mb-2">Test Results</h3>
          <ul className="space-y-1">
            {testResults.map((r, i) => (
              <li key={i} className={r.ok ? 'text-green-700' : 'text-red-700'}>
                {r.ok ? '✔' : '✖'} {r.message}
              </li>
            ))}
          </ul>
          <div className="mt-4 flex space-x-2">
            {testResults.every(r => r.ok) ? (
              <button
                className="px-4 py-2 bg-indigo-600 text-white rounded"
                onClick={handleApprove}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Approve Rule'}
              </button>
            ) : (
              <div className="w-full">
                <label className="block font-medium mb-1">Feedback (why it failed)</label>
                <textarea
                  className="w-full border p-2 rounded"
                  rows={2}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />
                <button
                  className="mt-2 px-4 py-2 bg-yellow-600 text-white rounded"
                  onClick={handleRefine}
                  disabled={loading || !feedback.trim()}
                >
                  {loading ? 'Refining...' : 'Refine Rule'}
                </button>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default RuleAuthoringStudio;

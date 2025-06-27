"use client";

import { useState } from "react";

export default function TestUploadPage() {
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const testSimpleUpload = async () => {
    setLoading(true);
    setResult("");

    try {
      const response = await fetch("/api/test-upload", {
        method: "POST",
      });

      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testFileUpload = async () => {
    setLoading(true);
    setResult("");

    try {
      // Create a simple test file
      const testFile = new File(["Hello World"], "test.txt", {
        type: "text/plain",
      });

      const formData = new FormData();
      formData.append("file", testFile);
      formData.append("title", "Test File");
      formData.append("category", "test");

      const response = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Upload Test Page</h1>

      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={testSimpleUpload}
          disabled={loading}
          style={{
            padding: "10px 20px",
            marginRight: "10px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          {loading ? "Testing..." : "Test Simple Upload"}
        </button>

        <button
          onClick={testFileUpload}
          disabled={loading}
          style={{
            padding: "10px 20px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          {loading ? "Testing..." : "Test File Upload"}
        </button>
      </div>

      <div>
        <h2>Result:</h2>
        <pre
          style={{
            backgroundColor: "#f8f9fa",
            padding: "15px",
            borderRadius: "4px",
            overflow: "auto",
            whiteSpace: "pre-wrap",
            border: "1px solid #dee2e6",
          }}
        >
          {result || "No result yet. Click a button to test."}
        </pre>
      </div>

      <div style={{ marginTop: "20px", fontSize: "14px", color: "#666" }}>
        <p>
          <strong>Instructions:</strong>
        </p>
        <ol>
          <li>
            First, click "Test Simple Upload" to verify basic storage
            functionality
          </li>
          <li>Then click "Test File Upload" to test the full upload process</li>
          <li>
            Check your browser's developer console and your Next.js server logs
            for detailed error messages
          </li>
        </ol>
      </div>
    </div>
  );
}

import React, { useState, useRef } from 'react';

const apiUrl = "http://127.0.0.1:8000";

function PdfUploader({ onFileSelect, onTextExtracted }) {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef();

  const handleChange = async (event) => {
    const file = event.target.files[0];

    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Only PDF files are allowed.');
      onFileSelect(null);
    } else {
      setError(null);
      onFileSelect(file);
    }
    
    // call extract text API
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await fetch(apiUrl + "/upload_pdf", {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();

      if (data.text) {
        onTextExtracted(data.text);
      } else {
        setError('Invalid response from server.');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to upload PDF.');
    } finally {
      setLoading(false);
    }

  };

  return (
    <div>
      {!loading && (
        <div>
          <button
            onClick={() => inputRef.current.click()}
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              padding: '10px 20px',
              fontSize: '16px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Browse...
          </button>

          <input
            ref={inputRef}
            type="file"
            accept=".pdf"
            onChange={handleChange}
            style={{ display: 'none' }}
          />
        </div>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading && (
        <div style={{ marginTop: '10px' }}>
          <img
            src="https://i.gifer.com/ZZ5H.gif"
            alt="Loading..."
            width="40"
          />
          <p>Uploading and extracting text...</p>
        </div>
      )}
    </div>
  );
}

export default PdfUploader;

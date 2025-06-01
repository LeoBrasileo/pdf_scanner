import './App.css';
import React, { useState, useEffect } from 'react';
import PdfUploader from './components/PdfUploader';
import DownloadButton from './components/DownloadButton';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [extractedText, setExtractedText] = useState('');

  useEffect(() => {
    document.title = 'PDF Text Extractor';
  }, []);

  return (
    <div className="App">

      <div style={{ padding: '20px' }}>
        <h1>Select a PDF file to extract the text</h1>
        <PdfUploader 
        onFileSelect={setSelectedFile}
        onTextExtracted={setExtractedText} />

        {selectedFile && (
          <div>
            <p>Selected file: <strong>{selectedFile.name}</strong></p>
          </div>
        )}
        {selectedFile && extractedText && (
          <div>
            <DownloadButton filename={selectedFile.name} />
          </div>
        )}
      </div>

      {extractedText && (
        <div style={{ marginTop: '4px' }}>
          <h3>Extracted Text:</h3>
          <div style={{
            whiteSpace: 'pre-wrap',
            border: '1px solid #ccc',
            padding: '10px',
            backgroundColor: '#f9f9f9'
          }}> 
            {extractedText}
          </div>
        </div>
      )}

    </div>
  );
}

export default App;

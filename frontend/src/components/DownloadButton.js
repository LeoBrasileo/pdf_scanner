import React from "react";

const apiUrl = "http://127.0.0.1:8000";

function DownloadButton({ filename }) {
  const handleDownload = async () => {
    try {
      const response = await fetch(`${apiUrl}/download_text/${filename}`);
      if (!response.ok) throw new Error('Failed to download');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = filename.replace('.pdf', '.txt');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Error downloading text file.');
      console.error(err);
    }
  };

  return (
    <button
      onClick={handleDownload}
      style={{
        backgroundColor: '#fc8c03',
        color: 'white',
        padding: '10px 20px',
        fontSize: '16px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    }}
    >
      Download Text File
    </button>
  );
}

export default DownloadButton;
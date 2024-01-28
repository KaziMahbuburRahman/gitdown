import React, { useState } from 'react';
import JSZip from 'jszip';

const App = () => {
  const [folderUrl, setFolderUrl] = useState('');

  const handleDownload = async () => {
    try {
      // Fetch file URLs from GitHub API
      const response = await fetch(`${folderUrl}?recursive=1`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(`Failed to fetch folder content: ${data.message}`);
      }

      const files = data.tree.filter(item => item.type === 'blob');

      // Create a zip file using JSZip
      const zip = new JSZip();

      // Add each file to the zip file
      await Promise.all(files.map(async file => {
        const fileUrl = `https://raw.githubusercontent.com${file.path}`;
        const fileContent = await fetch(fileUrl);

        if (!fileContent.ok) {
          throw new Error(`Failed to fetch file content: ${fileContent.statusText}`);
        }

        const fileContentText = await fileContent.text();
        zip.file(file.path, fileContentText);
      }));

      // Generate and trigger download of the zip file
      zip.generateAsync({ type: 'blob' }).then(blob => {
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = 'github-folder.zip';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      });
    } catch (error) {
      console.error('Error downloading files:', error.message);
    }
  };

  return (
    <div>
      <h1>Github Folder Downloader</h1>
      <input
        type="text"
        value={folderUrl}
        onChange={(e) => setFolderUrl(e.target.value)}
        placeholder="Enter GitHub folder URL"
      />
      <button onClick={handleDownload}>Download Folder</button>
    </div>
  );
};

export default App;

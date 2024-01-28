// api/download.js

import fetch from 'node-fetch';

export default async function handler(req, res) {
  try {
    const { folderUrl } = req.body;

    if (!folderUrl) {
      throw new Error('Missing folderUrl in the request body');
    }

    const apiUrl = `${folderUrl}?recursive=1`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Failed to fetch folder content: ${errorData}`);
    }

    const data = await response.json();

    if (!data || !Array.isArray(data.tree)) {
      throw new Error('Invalid response from GitHub API');
    }

    const files = data.tree.filter(item => item.type === 'blob');
    const fileContents = await Promise.all(files.map(async file => {
      const fileUrl = `https://raw.githubusercontent.com${file.path}`;
      const fileContent = await fetch(fileUrl);

      if (!fileContent.ok) {
        throw new Error(`Failed to fetch file content: ${fileContent.statusText}`);
      }

      return { path: file.path, content: await fileContent.text() };
    }));

    res.status(200).json(fileContents);
  } catch (error) {
    console.error('Error downloading files:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

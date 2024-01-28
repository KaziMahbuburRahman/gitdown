import JSZip from 'jszip';

function App() {


  // Initialize state for the URL
  // const [url, setUrl] = useState('');

  // // Update the URL state based on user input
  // const handleUrlChange = (event) => {
  //   setUrl(event.target.value);
  // };

  const downRepo = (url) => {
    // console.log('URL:', url);
    // Access the input field value using useRef

    // Perform actions based on the provided URL
    const match = url.match(/github\.com\/([^/]+)\/([^/]+)(\/tree\/[^/]+\/(.+))?/);

  
    // window.transformedPart = transformedPart;
    if (match) {
      const [fullMatch, owner, repo, branch, folder] = match;

      // console.log("Full Match:", fullMatch);
      // console.log("Owner:", owner);
      // console.log("Repo:", repo);
      // console.log("Branch:", branch);
      // console.log("Folder:", folder); 
      window.owner = owner;
      window.repo = repo;
      window.branch = branch;
      window.folder = folder;
      // If folder is not provided, assume the whole repository is intended for download
      if (!folder) {
        const confirmDownload = window.confirm(
          `⚠️ Warning!\n\nYou have entered a full GitHub repository URL instead of a folder URL.\nAre you sure you want to download the entire repository '${url}'?`
        );


        if (!confirmDownload) {
          return;
        }
      }

      const githubAPI = `https://api.github.com/repos/${owner}/${repo}/contents/${folder || ''}`;

      // Fetch data from the GitHub API
      fetch(githubAPI)
        .then(response => response.json())
        .then(data => {
          // Filter out only files from the data
          const files = data.filter(item => item.type === 'file');
          // Call the zipFiles function with the filtered files
          zipFiles(files);
        }).catch(() => {

          alert('This is an invalid or private repository. Please make it public for a while to download it.')
        });
        
    } else {
      alert('Please Enter a Github Repository URL');
    }
  }

  const handlePaste = (event) => {
    // Handle paste event
    console.log('Pasted:', event.clipboardData.getData('text'));
    const pastedText = event.clipboardData.getData('text');
    // Remove extra spaces from the pasted text
    const url = pastedText.trim();
    // console.log(event)
    setTimeout(() => {
      downRepo(url)
    }, 500);
  };

  const handleButtonClick = async (e) => {
    e.preventDefault()
    const url = e.target.elements.urlInput.value;
    downRepo(url)

  };

  function zipFiles(files) {
    const zip = new JSZip();

    const promises = files.map(item => {
      return fetch(item.download_url)
        .then(response => response.blob())
        .then(blob => {
          // Add each file to the ZIP archive
          zip.file(item.name, blob);
        });
    });

    // Wait for all promises to resolve before generating the ZIP
    Promise.all(promises).then(() => {
      // Generate the ZIP file
      zip.generateAsync({ type: 'blob' })
        .then(content => {
          const objectURL = URL.createObjectURL(content);
          const a = document.createElement('a');
          a.href = objectURL;
          a.download = `${folder ? owner + "_" + repo + branch : owner + "_" + repo}.zip`;
          document.body.appendChild(a);
          a.click();
          URL.revokeObjectURL(objectURL);
        });
    });
  }

  return (
    <div>
      {/* Input field for the URL */}
      <form onSubmit={handleButtonClick}>
        <input type="url" onPaste={handlePaste} name="urlInput" placeholder="Enter GitHub URL" />

        {/* Button to trigger the action */}
        <button type='submit'>Generate Archive</button>
      </form>
    </div>
  );
}

export default App;

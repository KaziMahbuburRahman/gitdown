import JSZip from 'jszip';
import { NavbarComponent } from './NavbarComponent';
import LoadingIcon from './icons/LoadingIcon';
import { useEffect, useState } from 'react';
import Footer from './Footer';
import CheckIcon from './icons/CheckIcon';
import DownloadIcon from './icons/DownloadIcon';
import ThemeChanger from './shared/ThemeChanger';
import ReactDOM from "react-dom"



function App() {

  const [downloadLink, setDownloadLink] = useState('');
  const [downloadFileName, setDownloadFileName] = useState('');
  const [sizeMB, setsizeMB] = useState('');
  const [data, setData] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [warning, setWarning] = useState(false);




  // useEffect(() => {
  //   // Call thumbImg when the component mounts
  //   thumbImg(window.owner, window.repo);
  // }, []);
  // Initialize state for the URL
  // const [url, setUrl] = useState('');

  // // Update the URL state based on user input
  // const handleUrlChange = (event) => {
  //   setUrl(event.target.value);
  // };

  const downRepo = (url) => {
    console.log("url from downrepo:", url);
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
      // setOwner(owner);
      // setRepo(repo);
      window.branch = branch;
      window.folder = folder;
      // If folder is not provided, assume the whole repository is intended for download
      if (!folder) {
        setWarning(true)
      }

      const githubAPI = `https://api.github.com/repos/${owner}/${repo}/contents/${folder || ''}`;

      // Fetch data from the GitHub API
      fetch(githubAPI)
        .then(response => response.json())
        .then(data => {
          setData(data);
          // Filter out only files from the data
          //will uncomment later
          // const files = data.filter(item => item.type === 'file');

          // // Call the zipFiles function with the filtered files
          zipFiles(data);
        }).catch(() => {

          alert('This is an invalid or private repository. Please make it public for a while to download it.')
        });

    } else {
      alert('Please Enter a Github Repository URL');
    }
  }

  const handlePaste = (event) => {
    setLoading(true);
    // Handle paste event
    console.log('Pasted:', event.clipboardData.getData('text'));
    const pastedText = event.clipboardData.getData('text');
    console.log("pastedtext", pastedText);
    // Remove extra spaces from the pasted text
    const url = pastedText.trim();
    // console.log(event)
    setTimeout(() => {
      downRepo(url)
    }, 500);
  };

  const handleButtonClick = async (e) => {
    e.preventDefault()
    setLoading(true);
    const url = e.target.elements.urlInput.value;
    downRepo(url)

  };

  function zipFiles(files) {
    const zip = new JSZip();

    const processItem = (item, path = '') => {
      if (item.type === 'file') {
        // If it's a file, fetch and add it to the ZIP archive
        return fetch(item.download_url)
          .then(response => response.blob())
          .then(blob => {
            zip.file(path + item.name, blob);
          });
      } else if (item.type === 'dir') {
        // If it's a directory, recursively process its contents
        return fetch(item.url)
          .then(response => response.json())
          .then(contents => {
            const subPromises = contents.map(subItem => processItem(subItem, path + item.name + '/'));
            return Promise.all(subPromises);
          });
      }
      // For unknown types, return a resolved promise
      return Promise.resolve();
    };

    // Process each item in the provided files array
    const promises = files.map(item => processItem(item));

    // Wait for all promises to resolve before generating the ZIP
    Promise.all(promises).then(() => {
      // Generate the ZIP file
      zip.generateAsync({ type: 'blob' })
        .then(content => {
          const sizeBytes = content.size;
          console.log(sizeBytes);
          const objectURL = URL.createObjectURL(content);
          let sizeDisplay, sizeUnit;

          if (sizeBytes >= 1024 * 1024 * 1024 * 1024) {
            const sizeTB = sizeBytes / (1024 * 1024 * 1024 * 1024);
            sizeDisplay = sizeTB.toFixed(2);
            sizeUnit = 'TB';
          } else if (sizeBytes >= 1024 * 1024 * 1024) {
            const sizeGB = sizeBytes / (1024 * 1024 * 1024);
            sizeDisplay = sizeGB.toFixed(2);
            sizeUnit = 'GB';
          } else if (sizeBytes >= 1024 * 1024) {
            const sizeMB = sizeBytes / (1024 * 1024);
            sizeDisplay = sizeMB.toFixed(2);
            sizeUnit = 'MB';
          } else if (sizeBytes >= 1024) {
            const sizeKB = sizeBytes / 1024;
            sizeDisplay = sizeKB.toFixed(2);
            sizeUnit = 'KB';
          } else {
            sizeDisplay = sizeBytes.toFixed(2);
            sizeUnit = 'Bytes';
          }

          setsizeMB(`${sizeDisplay} ${sizeUnit}`);
          console.log(sizeMB);
          console.log(objectURL);
          // const a = document.createElement('a');
          // a.href = objectURL;
          let downloadFileName = `${folder ? owner + "_" + repo + branch : owner + "_" + repo}.zip : ${owner}_${repo}`;
          console.log("downloadFileName:", downloadFileName);
          setDownloadLink(objectURL);
          setDownloadFileName(downloadFileName);
          // setFileName(`${folder ? owner + "_" + repo + branch : owner + "_" + repo}.zip`);
          // document.body.appendChild(a);
          // // saveas
          // saveas(objectURL, `${folder ? owner + "_" + repo + branch : owner + "_" + repo}.zip`);
          // a.click();
          // URL.revokeObjectURL(objectURL);
        });
    });

  }

  const downloadImage = async () => {
    const imageUrl = `https://opengraph.githubassets.com/e61b97681f68c6b6893f9386c313d502fdfb7b512bdf4f187b2582bc0378b0c6/${owner}/${repo}`;

    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const objectURL = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = objectURL;
      a.download = `${owner}_${repo}_thumbnail.png`; // You can customize the filename
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(objectURL);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  const [isShowing, setIsShowing] = useState(false)


  return (
    <div className='bg-slate-300'>
      <header className='bg-white'>
        <NavbarComponent />

      </header>
      <div className='container bg-white min-h-screen max-w-[960px] mx-auto rounded-lg my-5 p-5'>
        {/* Input field for the URL */}
        <h2 className='text-3xl text-center font-bold text-gray-700'>Github Folder Downloader</h2>
        <p className='text-center mt-5'>Download github repository and folders for free!</p>
        <form className='flex justify-center items-center my-5' onSubmit={handleButtonClick}>
          <input className='w-[100%] mr-5 p-5 rounded-md border-2 border-blue-950' type="url" onPaste={handlePaste} name="urlInput" placeholder="Enter GitHub URL" />


          {/* Button to trigger the action */}
          <button
            type='submit'
            style={{ boxShadow: '0 5px 15px 5px rgba(34, 125, 199, .42)' }}
            className="text-xl px-10 py-5 text-center align-middle m-0-auto bg-sky-600 rounded-xl hover:bg-slate-700 border-0 border-none text-white duration-300 hover:shadow-none focus:outline-none focus:ring-0 focus:border-none active:outline-none active:ring-0 active:border-none shadow-xl transition duration-300 ease-in-out"
          >
            Download
          </button>


        </form>
        {/* warning msg start */}
        {sizeMB && warning && <div
          className="flex w-full items-start gap-4 rounded border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-500"
          role="alert"
        >
          {/*  <!-- Icon --> */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.5"
            role="graphics-symbol"
            aria-labelledby="title-07 desc-07"
          >
            <title id="title-07">Icon title</title>
            <desc id="desc-07">A more detailed description of the icon</desc>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          {/*  <!-- Text --> */}
          {/* warning message */}
          <div>
            <h3 className="mb-2 font-semibold">
              You have entered a GitHub repository URL instead of a folder URL!
            </h3>
            <p>
              You will download the entire repository instead of a github folder.
            </p>
          </div>
        </div>}

        {loading && !sizeMB && <LoadingIcon />}
        {/* <label htmlFor="my-modal-3" className="btn">open modal</label> */}

        {/* Put this part before </body> tag */}

        {/* New Modal */}


        {isShowing && typeof document !== "undefined"
          ? ReactDOM.createPortal(
            <div
              className="fixed top-0 left-0 z-20 flex h-screen w-screen items-center justify-center bg-slate-300/20 backdrop-blur-sm"
              aria-labelledby="header-3a content-3a"
              aria-modal="true"
              tabindex="-1"
              role="dialog"
            >
              {/*    <!-- Modal --> */}
              <div
                // ref={wrapperRef}
                className="flex max-h-[90vh] w-11/12 max-w-xl flex-col gap-6 overflow-hidden rounded bg-white p-6 text-slate-500 shadow-xl shadow-slate-700/10"
                id="modal"
                role="document"
              >
                {/*        <!-- Modal header --> */}
                <header id="header-3a" className="flex items-center gap-4">
                  <h3 className="flex-1 text-xl font-medium text-slate-700">
                    Downloaded {data.length} files!
                  </h3>

                  <button
                    onClick={() => setIsShowing(false)}
                    className="inline-flex h-10 items-center justify-center gap-2 justify-self-center whitespace-nowrap rounded-full px-5 text-sm font-medium tracking-wide text-gray-500 transition duration-300 hover:bg-gray-100 hover:text-gray-600 focus:bg-gray-200 focus:text-gray-700 focus-visible:outline-none disabled:cursor-not-allowed disabled:text-gray-300 disabled:shadow-none disabled:hover:bg-transparent"
                    aria-label="close dialog"
                  >
                    <span className="relative only:-mx-5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        role="graphics-symbol"
                        aria-labelledby="title-79 desc-79"
                      >
                        <title id="title-79">Icon title</title>
                        <desc id="desc-79">
                          A more detailed description of the icon
                        </desc>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </span>
                  </button>
                </header>
                {/*        <!-- Modal body --> */}
                <div id="content-3a" className="flex-1 overflow-auto">
                  <p>
                    Thank you for using our service. If you could share our website with your friends, that would be a great help.
                  </p>
                  <div class="border-3 border-outset border-black text-center w-99 p-5">
                    <div class="bg-[#4267B2] m-5 p-3 rounded text-centera">
                      <a href="https://facebook.com/TechHelpBD" target="_blank" rel="noopener noreferrer" class="text-white font-bold no-underline">LIKE US ON FACEBOOK</a>
                    </div>
                    <div class="bg-[#006AFF] m-5 p-3 rounded text-center">
                      <a href="https://www.facebook.com/groups/techhelpbangladesh" target="_blank" rel="noopener noreferrer" class="text-white font-bold no-underline">JOIN OUR FACEBOOK GROUP</a>
                    </div>
                    <div class="bg-[#075e54] m-5 p-3 rounded text-center">
                      <a href="https://chat.whatsapp.com/KsnXhnqsG9g3lxXE6nMheE" target="_blank" rel="noopener noreferrer" class="text-white font-bold no-underline">JOIN OUR WHATSAPP GROUP</a>
                    </div>
                    <div class="bg-[#5865F2] m-5 p-3 rounded text-center">
                      <a href="https://discord.gg/Gb3wqdsRyp" target="_blank" rel="noopener noreferrer" class="text-white font-bold no-underline">JOIN OUR DISCORD SERVER</a>
                    </div>
                    <div class="bg-[#0088cc] m-5 p-3 rounded text-center">
                      <a href="http://t.me/techhelpbangladesh" target="_blank" rel="noopener noreferrer" class="text-white font-bold no-underline">JOIN OUR TELEGRAM GROUP</a>
                    </div>
                    <div class="bg-[#FF0000] m-5 p-3 rounded text-center">
                      <a href="https://youtube.com/TechHelpBangladesh" target="_blank" rel="noopener noreferrer" class="text-white font-bold no-underline">SUBSCRIBE OUR YOUTUBE CHANNEL</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>,
            document.body
          )
          : null}


       

        {
          sizeMB && (<div>
            {/* flex item 1 */}

            <div className="flex justify-center items-center  min-w-full my-10 shadow-md p-8 rounded-lg border-t border-l border-l-[#005eb6] border-t-[#005eb6] border-b-2 border-r-2 border-b-[#0084ff] border-r-[#0084ff]  space-x-5">

              <div className='flex-1'>
                <p className="text-sky-900 text-xl font-semibold mb-5">Zipped {data.length} Files</p>
                <ul className="space-y-3">
                  {data.map((item) => (
                    <li className="flex items-center gap-2 text-sm text-sky-900 font-semibold"><CheckIcon />{item.name}</li>

                  ))}


                </ul>

                <h2 className='mt-5 text-xl font-semibold  text-sky-900'>Size: {sizeMB}</h2>

                <div className="mr-8">
                  <button onClick={() => {

                    const a = document.createElement('a');
                    a.href = downloadLink;
                    a.download = downloadFileName;
                    console.log(downloadLink)
                    console.log(downloadFileName)
                    document.body.appendChild(a);
                    a.click();
                    //delay
                    setTimeout(() => {
                      setIsShowing(true)
                    }, 500);
                    // document.getElementById('my-modal-3').checked = true;
                    // URL.revokeObjectURL(downloadLink);
                  }} className="my-5 inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded border border-sky-500 text-sky-500 px-6 outline-none bg-transparent active:text-sky-600 transition duration-200 active:scale-90 ">
                    <span className="order-2">Download</span>
                    <span className="relative only:-mx-6">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        role="graphics-symbol"
                        aria-labelledby="title-62 desc-62"
                      >
                        <title id="title-62">Icon title</title>
                        <desc id="desc-62">A more detailed description of the icon</desc>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                        />
                      </svg>
                    </span>
                  </button>
                </div>



                {/* <button
                  onClick={() => {

                    const a = document.createElement('a');
                    a.href = downloadLink;
                    a.download = downloadFileName;
                    console.log(downloadLink)
                    console.log(downloadFileName)
                    document.body.appendChild(a);
                    a.click();
                    //delay
                    setTimeout(() => {
                      document.getElementById('my-modal-3').checked = true;
                    }, 400);
                    // document.getElementById('my-modal-3').checked = true;
                    // URL.revokeObjectURL(downloadLink);
                  }}
                  style={{ boxShadow: '0 5px 15px 5px rgba(34, 125, 199, .42)' }}
                  className="text-xl px-10 py-5 text-center align-middle m-0-auto bg-sky-600 rounded-xl hover:bg-slate-700 border-0 border-none text-white duration-300 hover:shadow-none focus:outline-none focus:ring-0 focus:border-none active:outline-none active:ring-0 active:border-none shadow-xl transition duration-300 ease-in-out"
                >
                  Download
                </button> */}

              </div>



              <div className='flex-1 pt-2'>

                <div className="overflow-hidden rounded bg-white text-slate-500">


                  {/*  <!-- Header--> */}

                  {/*  <!-- Image --> */}
                  <figure>
                    <img
                      src={`https://opengraph.githubassets.com/e61b97681f68c6b6893f9386c313d502fdfb7b512bdf4f187b2582bc0378b0c6/${owner}/${repo}`}
                      alt="card image"
                      className="w-full"
                    />
                  </figure>
                  {/*  <!-- Body--> */}
                  <div className="p-6 mt-5">
                    <p>
                      {`${owner}_${repo}_thumbnail.png`}
                    </p>
                  </div>
                  {/*  <!-- Action icon buttons --> */}
                  <div className="flex justify-end gap-2 p-2 pt-0 mt-2">
                    <button onClick={downloadImage} className="text-sky-500 inline-flex h-10 items-center justify-center gap-2 justify-self-center whitespace-nowrap rounded px-5 outline-none bg-transparent border-none active:text-blue-500 transition duration-200 active:scale-90">
                      <span className="relative only:-mx-6">
                        <DownloadIcon />
                      </span>
                    </button>
                    <button onClick={() => { navigator.clipboard.writeText(`https://opengraph.githubassets.com/e61b97681f68c6b6893f9386c313d502fdfb7b512bdf4f187b2582bc0378b0c6/${owner}/${repo}`) }} className="inline-flex h-11 items-center justify-center gap-2 justify-self-center whitespace-nowrap rounded px-5 text-sm font-medium  text-sky-500 outline-none bg-transparent border-none active:text-blue-500 transition duration-200 active:scale-90">
                      <span className="relative only:-mx-6">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          role="graphics-symbol"
                          aria-labelledby="title-82 desc-82"
                        >
                          <title id="title-82">Share</title>
                          <desc id="desc-82">
                            A more detailed description of the icon
                          </desc>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                          />
                        </svg>
                      </span>
                    </button>
                  </div>



                </div>
              </div>
            </div>



          </div>)
        }
        {/* loading */}
        {/* <LoadingIcon /> */}
      </div>
      <Footer />
    </div>
  );
}

export default App;

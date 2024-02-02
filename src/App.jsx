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
      setWarning(false)
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
      <header>
        <NavbarComponent />

      </header>
      <div className='container m-0 bg-white min-h-screen max-w-[960px] mx-auto lg:rounded-md rounded-none lg:my-5 p-5'>
        {/* Input field for the URL */}
        <h2 className='text-3xl text-center font-bold text-gray-700'>Github Folder Downloader</h2>
        <p className='text-center mt-5'>Download github repository and folders for free!</p>
        <form className='flex flex-col sm:flex-row justify-center items-center my-5' onSubmit={handleButtonClick}>
          <input className='w-[100%] mr-auto mb-5 sm:mr-5 p-5 rounded-md border-2 border-blue-950' type="url" onPaste={handlePaste} name="urlInput" placeholder="Enter GitHub URL" />


          {/* Button to trigger the action */}
          <button
            type='submit'
            style={{ boxShadow: '0 5px 15px 5px rgba(34, 125, 199, .42)' }}
            className="w-full mb-5 sm:w-auto text-xl px-10 py-5 text-center align-middle  bg-sky-600 rounded-xl hover:bg-slate-700 border-0 border-none text-white duration-300 hover:shadow-none focus:outline-none focus:ring-0 focus:border-none active:outline-none active:ring-0 active:border-none shadow-xl transition duration-300 ease-in-out"
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
                      <a href="https://Youtube.com/TechHelpBangladesh" target="_blank" rel="noopener noreferrer" class="text-white font-bold no-underline">SUBSCRIBE OUR YouTube CHANNEL</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>,
            document.body
          )
          : null}




        {
          sizeMB ? (<div>
            {/* flex item 1 */}

            <div className="flex flex-col-reverse sm:flex-row justify-center items-center  min-w-full my-10 shadow-md p-8 rounded-lg border-t border-l border-l-[#005eb6] border-t-[#005eb6] border-b-2 border-r-2 border-b-[#0084ff] border-r-[#0084ff]  space-x-5">

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


              <div className='flex-1 pt-2 max-w-full overflow-x-auto'>

                <div className="min-w-full overflow-hidden rounded bg-white text-slate-500">


                  {/*  <!-- Header--> */}

                  {/*  <!-- Image --> */}
                  <figure>
                    <img
                      src={`https://opengraph.githubassets.com/e61b97681f68c6b6893f9386c313d502fdfb7b512bdf4f187b2582bc0378b0c6/${owner}/${repo}`}
                      alt="card image"
                      className="w-auto overflow-hidden"
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



          </div>) : <div>
            <h2 className='text-3xl font-bold text-gray-700 text-center m-5'>Free Online Github Folder Downloader</h2>
            <p className='text-center mb-10'>Are you tired of struggling to download your favorite Github Folders? Do you want a fast, reliable, and user-friendly solution to enjoy your beloved code offline? Look no further! GitDown Github Folder Downloader is here to revolutionize your Folder downloading experience.

              Discover the seamless experience with GitDown Github Downloader, enabling you to effortlessly download your desired Github Folders in high-quality for convenient offline viewing.</p>

            <section className='mb-10'>
              <div className="container px-6 m-auto">
                <div className="grid grid-cols-4 gap-6 md:grid-cols-8 lg:grid-cols-12">
                  <div className="col-span-4">
                    <h2 className='mr-5 sm:mr-20 lg:mr-10  flex flex-col justify-center items-center text-xl font-bold'><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-sky-500">
                      <path fillRule="evenodd" d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 0 1 .75.75c0 5.056-2.383 9.555-6.084 12.436A6.75 6.75 0 0 1 9.75 22.5a.75.75 0 0 1-.75-.75v-4.131A15.838 15.838 0 0 1 6.382 15H2.25a.75.75 0 0 1-.75-.75 6.75 6.75 0 0 1 7.815-6.666ZM15 6.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" clipRule="evenodd" />
                      <path d="M5.26 17.242a.75.75 0 1 0-.897-1.203 5.243 5.243 0 0 0-2.05 5.022.75.75 0 0 0 .625.627 5.243 5.243 0 0 0 5.022-2.051.75.75 0 1 0-1.202-.897 3.744 3.744 0 0 1-3.008 1.51c0-1.23.592-2.323 1.51-3.008Z" />
                    </svg>
                    </h2>
                    <h2 className='my-3 text-xl font-bold text-gray-700 text-left'>Multiple Format Support</h2>
                    <p className='text-left'>GitDown can download both github repository and folders</p>
                  </div>
                  <div className=" col-span-4"><h2 className='mr-5 sm:mr-20 lg:mr-10 flex flex-col justify-center items-center text-xl font-bold'><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-12 w-12 text-orange-600">
                    <path fillRule="evenodd" d="M7.502 6h7.128A3.375 3.375 0 0 1 18 9.375v9.375a3 3 0 0 0 3-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 0 0-.673-.05A3 3 0 0 0 15 1.5h-1.5a3 3 0 0 0-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6ZM13.5 3A1.5 1.5 0 0 0 12 4.5h4.5A1.5 1.5 0 0 0 15 3h-1.5Z" clipRule="evenodd" />
                    <path fillRule="evenodd" d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 0 1 3 20.625V9.375ZM6 12a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H6.75a.75.75 0 0 1-.75-.75V12Zm2.25 0a.75.75 0 0 1 .75-.75h3.75a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75ZM6 15a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H6.75a.75.75 0 0 1-.75-.75V15Zm2.25 0a.75.75 0 0 1 .75-.75h3.75a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75ZM6 18a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H6.75a.75.75 0 0 1-.75-.75V18Zm2.25 0a.75.75 0 0 1 .75-.75h3.75a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
                  </svg>


                  </h2>
                    <h2 className='my-3 text-xl font-bold text-gray-700 text-left'>Paste & Download Folders</h2>
                    <p className='text-left'>If you paste the Github url on input field then our algorithm will detect the url and automatically convert the files for you. No more hassle for pressing Enter button.</p>
                  </div>
                  <div className="col-span-4"><h2 className='mr-5 sm:mr-20 lg:mr-10 flex flex-col justify-center items-center text-xl font-bold'><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-12 w-12 text-slate-600">
                    <path fillRule="evenodd" d="M8.25 6.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM15.75 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM2.25 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM6.31 15.117A6.745 6.745 0 0 1 12 12a6.745 6.745 0 0 1 6.709 7.498.75.75 0 0 1-.372.568A12.696 12.696 0 0 1 12 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 0 1-.372-.568 6.787 6.787 0 0 1 1.019-4.38Z" clipRule="evenodd" />
                    <path d="M5.082 14.254a8.287 8.287 0 0 0-1.308 5.135 9.687 9.687 0 0 1-1.764-.44l-.115-.04a.563.563 0 0 1-.373-.487l-.01-.121a3.75 3.75 0 0 1 3.57-4.047ZM20.226 19.389a8.287 8.287 0 0 0-1.308-5.135 3.75 3.75 0 0 1 3.57 4.047l-.01.121a.563.563 0 0 1-.373.486l-.115.04c-.567.2-1.156.349-1.764.441Z" />
                  </svg>


                  </h2>
                    <h2 className='my-3 text-xl font-bold text-gray-700 text-left'>User-Friendly Interface</h2>
                    <p className='text-left'>GitDown is designed for ease of use. Our simple and intuitive interface allows you to download and convert Folders in just a few clicks, without the need for any technical knowledge or expertise.</p>
                  </div>
                  <div className="col-span-4"><h2 className='mr-5 sm:mr-20 lg:mr-10 flex flex-col justify-center items-center text-xl font-bold'><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-12 w-12 text-amber-400">
                    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-2.625 6c-.54 0-.828.419-.936.634a1.96 1.96 0 0 0-.189.866c0 .298.059.605.189.866.108.215.395.634.936.634.54 0 .828-.419.936-.634.13-.26.189-.568.189-.866 0-.298-.059-.605-.189-.866-.108-.215-.395-.634-.936-.634Zm4.314.634c.108-.215.395-.634.936-.634.54 0 .828.419.936.634.13.26.189.568.189.866 0 .298-.059.605-.189.866-.108.215-.395.634-.936.634-.54 0-.828-.419-.936-.634a1.96 1.96 0 0 1-.189-.866c0-.298.059-.605.189-.866Zm2.023 6.828a.75.75 0 1 0-1.06-1.06 3.75 3.75 0 0 1-5.304 0 .75.75 0 0 0-1.06 1.06 5.25 5.25 0 0 0 7.424 0Z" clipRule="evenodd" />
                  </svg>
                  </h2>
                    <h2 className='my-3 text-xl font-bold text-gray-700 text-left'>No Software Installation Required</h2>
                    <p className='text-left'>Unlike many other Folder downloaders, GitDown is an online tool that doesn't require you to install any software on your device. Simply visit our website, enter the Folder URL, and start downloading your favorite code.</p>
                  </div>
                  <div className="col-span-4"><h2 className='mr-5 sm:mr-20 lg:mr-10 flex flex-col justify-center items-center text-xl font-bold'> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-12 w-12 text-red-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
                  </svg>

                  </h2>
                    <h2 className='my-3 text-xl font-bold text-gray-700 text-left'>Fast Download Speeds</h2>
                    <p className='text-left'>We understand that time is precious, so we have optimized our platform to provide you with the fastest download speeds possible. Say goodbye to long waiting times and hello to instant Folder gratification.</p>
                  </div>
                  <div className="col-span-4"><h2 className='mr-5 sm:mr-20 lg:mr-10 flex flex-col justify-center items-center text-xl font-bold'><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-12 w-12 text-green-600">
                    <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 0 0-1.032 0 11.209 11.209 0 0 1-7.877 3.08.75.75 0 0 0-.722.515A12.74 12.74 0 0 0 2.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 0 0 .374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 0 0-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08Zm3.094 8.016a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                  </svg>
                  </h2>
                    <h2 className='my-3 text-xl font-bold text-gray-700 text-left'>100% Virus Free Files</h2>
                    <p>GitDown downloads the folder's files from official Github website and then zip them together. Thats why our generated zip files are always safe as Github</p>
                  </div>
                </div>
              </div>
            </section>

            <section className='my-10'>
              <h2 className='mb-5 text-center text-gray-700 text-3xl font-bold'>The Best Github Downloader</h2>
              <p className='text-center'>So, what are you waiting for? Give GitDown Github Folder Downloader a try today and experience the ultimate in Folder downloading convenience and versatility. We are confident that you'll love our platform and never look back. Happy downloading!
                Upvote us on producthunt to make us No 1
              </p>
            </section>

            <section className='mb-10'>
              <h2 className='mb-5 text-center text-gray-700 text-3xl font-bold'>How to Download Github Folders</h2>
              <div className='flex justify-center items-center'>

                <ul class="list-none flex max-w-[23rem] md:max-w-full flex-col md:flex-row justify-center items-center">
                  <div className='flex max-w-[26rem] flex-1 justify-center items-center'>
                    <li class="flex items-start flex-1">
                      <span class="number flex items-center justify-center font-bold text-4xl w-16 h-16 rounded-full bg-blue-200 text-blue-500 mr-2 mb-2">1</span>

                    </li>
                    <li><span>Simply Enter your desired Github folder link</span></li>
                  </div>
                  <div className='flex max-w-[26rem] flex-1 justify-center items-center'>
                    <li class="flex items-start flex-1">
                      <span class="number flex items-center justify-center font-bold text-4xl w-16 h-16 rounded-full bg-red-200 text-red-500 mr-2 mb-2">2</span>
                    </li>
                    <li><span>Wait briefly for the zip conversion to finish</span></li>
                  </div>
                  <div className='flex max-w-[26rem] flex-1 justify-center items-center'>
                    <li class="flex items-start flex-1">
                      <span class="number flex items-center justify-center font-bold text-4xl w-16 h-16 rounded-full bg-green-200 text-green-500 mr-2 mb-2">3</span>
                    </li>
                    <li>
                      <span>Then click on download button to save the zip file on your device</span>
                    </li>
                  </div>
                </ul>

              </div>





            </section>

            <h2 className='text-3xl font-bold text-center mb-5 text-gray-700'>Frequently Asked Questions</h2>
            <section className="w-full divide-y divide-slate-200 rounded border border-slate-200 bg-white">

              <details className="group p-4" open>
                <summary className="relative cursor-pointer list-none pr-8 font-medium text-slate-700 transition-colors duration-300 focus-visible:outline-none group-hover:text-slate-900  [&::-webkit-details-marker]:hidden">
                  Is it legal to download Github folders using GitDown?
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute right-0 top-1 h-4 w-4 shrink-0 stroke-slate-700 transition duration-300 group-open:rotate-45"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    aria-labelledby="title-ac21 desc-ac21"
                  >
                    <title id="title-ac21">Open icon</title>
                    <desc id="desc-ac21">
                      icon that represents the state of the summary
                    </desc>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </summary>
                <p className="mt-4 text-slate-500">
                  Look Github already allowing you to download the repository from their website. But Github doesn’t let you download a single folder from a repository, which might be necessary when you just need a few files from a large repository. That's why we made this tool to help you download the folder from Github.
                  <br /> <br />
                  So, it's completely legal to download the folder from Github using GitDown.
                </p>
              </details>
              <details className="group p-4">
                <summary className="relative cursor-pointer list-none pr-8 font-medium text-slate-700 transition-colors duration-300 focus-visible:outline-none group-hover:text-slate-900  [&::-webkit-details-marker]:hidden">
                  Can I download the entire repository also using GitDown?
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute right-0 top-1 h-4 w-4 shrink-0 stroke-slate-700 transition duration-300 group-open:rotate-45"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    aria-labelledby="title-ac22 desc-ac22"
                  >
                    <title id="title-ac22">Open icon</title>
                    <desc id="desc-ac22">
                      icon that represents the state of the summary
                    </desc>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </summary>
                <p className="mt-4 text-slate-500">
                  Yes, sometimes you may change your decision to download whole repository instead of a single folder.
                  <br /> In that case, you can simply paste the repository link on the input field and then click on the download button. Our algorithm will detect the repository and then convert the entire repository as a zip file for you.
                  <br /><br />
                  But you may see a warning message. Don't worry, it's just because to let you know that you are downloading the entire repository instead of a folder.
                </p>
              </details>
              <details className="group p-4">
                <summary className="relative cursor-pointer list-none pr-8 font-medium text-slate-700 transition-colors duration-300 focus-visible:outline-none group-hover:text-slate-900  [&::-webkit-details-marker]:hidden">
                  How can I unzip the zipped Github folder?
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute right-0 top-1 h-4 w-4 shrink-0 stroke-slate-700 transition duration-300 group-open:rotate-45"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    aria-labelledby="title-ac24 desc-ac24"
                  >
                    <title id="title-ac24">Open icon</title>
                    <desc id="desc-ac24">
                      icon that represents the state of the summary
                    </desc>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </summary>
                <p className="mt-4 text-slate-500">
                  You can use any kind of zip extractor like <a className='font-bold' href="https://www.7-zip.org/" target="_blank" rel="noopener noreferrer">7-Zip </a>
                  or <a className='font-bold' href="https://www.win-rar.com/" target="_blank" rel="noopener noreferrer">Winrar</a> to unzip and access the files which are zipped inside the Github folder.</p>
              </details>
              <details className="group p-4">
                <summary className="relative cursor-pointer list-none pr-8 font-medium text-slate-700 transition-colors duration-300 focus-visible:outline-none group-hover:text-slate-900  [&::-webkit-details-marker]:hidden">
                  Is GitDown safe to use?
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute right-0 top-1 h-4 w-4 shrink-0 stroke-slate-700 transition duration-300 group-open:rotate-45"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    aria-labelledby="title-ac23 desc-ac23"
                  >
                    <title id="title-ac23">Open icon</title>
                    <desc id="desc-ac23">
                      icon that represents the state of the summary
                    </desc>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </summary>
                <p className="mt-4 text-slate-500">
                  GitDown is considered a safe and clean service, with no viruses and under intense supervision based on a security algorithm. However, always practice caution while using any online tool and ensure you have up-to-date security software on your device.
                </p>
              </details>
            </section>

          </div>
        }
        {/* loading */}
        {/* <LoadingIcon /> */}
      </div >
      <Footer />
    </div >
  );
}

export default App;

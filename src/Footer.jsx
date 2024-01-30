import { Link } from 'react-router-dom'
// import BackToUp from '@uiw/react-back-to-top';
const Footer = () => {
  return (
    <>
      <footer className="footer p-10 bg-neutral text-neutral-content">
        {/* <BackToUp>Top</BackToUp> */}
        <div>

          <p className='max-w-[26rem]'>
            Welcome to the Tech Help BD Compiler! <br /> <br />
            We are excited to provide you with a user-friendly online platform to compile your code. Our compiler supports various programming languages including C, C++, Java, Python, and more. <br />
            <br />

            Please feel free to provide any feedback to help us improve your experience. <br /> <br />

            - Tech Help BD Compiler Team


          </p>
        </div>
        <div>
          <span className="footer-title">Important Links</span>
          <a className="link-info text-white" href='https://techhelpbd.com/about-us' target='_blank' rel='noopener noreferrer'>About Us</a>
          <div className="link-info text-white" to="/contact">Contact Us</div>
          <div to="/saved-codes" className="link-info text-white">
            Saved Codes
          </div>
        </div>
        <div>
          <span className="footer-title">Follow Us</span>
          <div className="grid grid-flow-col gap-4">

            <a href='https://facebook.com/TechHelpBDdotCom' target='_blank' title='Facebook' rel='noopener noreferrer'>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30" height="30">
                <path d="M12.001 2.002c-5.522 0-9.999 4.477-9.999 9.999 0 4.99 3.656 9.126 8.437 9.879v-6.988h-2.54v-2.891h2.54V9.798c0-2.508 1.493-3.891 3.776-3.891 1.094 0 2.24.195 2.24.195v2.459h-1.264c-1.24 0-1.628.772-1.628 1.563v1.875h2.771l-.443 2.891h-2.328v6.988C18.344 21.129 22 16.992 22 12.001c0-5.522-4.477-9.999-9.999-9.999z" className="fill-current text-white hover:text-blue-600" />
              </svg>
            </a>

            <a href='https://youtube.com/@TechHelpBD' target='_blank' title='YouTube' rel='noopener noreferrer' ><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" className="fill-current"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" className="fill-current text-white hover:text-red-500"></path></svg></a>


            <a href='https://t.me/TechHelpBangladesh' target='_blank' title='Telegram' rel='noopener noreferrer'> <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" style={{ fill: "#ffffff", transform: "", msFilter: "" }}>
              <path d="m20.665 3.717-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42 10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701h-.002l.002.001-.314 4.692c.46 0 .663-.211.921-.46l2.211-2.15 4.599 3.397c.848.467 1.457.227 1.668-.785l3.019-14.228c.309-1.239-.473-1.8-1.282-1.434z" className="fill-current text-white hover:text-blue-500" />
            </svg>
            </a>



          </div>
        </div>


      </footer>
      <div className="bg-gray-900 py-6 w-full">
        <div className="container mx-auto text-center text-white font-medium">
          &copy; {new Date().getFullYear()}{" "}
          <a
            href="https://techhelpbd.com"
            className="text-green-500 hover:text-green-300 transition-colors duration-200"
            target='_blank' rel='noopener noreferrer'
          >
            Tech Help BD
          </a>
          . All rights reserved.
        </div>
      </div>


    </>
  )
}

export default Footer
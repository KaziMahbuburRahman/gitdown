import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom'
import HomeIcon from './icons/HomeIcon';
import SettingsIcon from './icons/SettingsIcon';

// import ThemeChanger from '../shared/ThemeChanger/ThemeChanger';
// import SettingsIcon from '../assets/svg/SettingsIcon'
// import HomeIcon from '../assets/svg/HomeIcon';

export const NavbarComponent = ({ openModal }) => {

  const [menuOpen, setMenuOpen] = useState(false);
  const [isToggleOpen, setIsToggleOpen] = useState(false)
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  // const NavMenus = (
  //   <>
  //     <li className='border-none lg:mr-6 py-2 lg:py-0'>
  //       <NavLink onClick={handleScrollToTop} to="/" className={({ isActive }) =>
  //         isActive ? "text-white btn btn-primary" : "btn glass text-black"
  //       }>
  //         <span className='hidden lg:block'>
  //           <HomeIcon />
  //         </span>
  //         <span className='lg:hidden block'>
  //           Home
  //         </span>
  //       </NavLink>
  //     </li>


  //     <li className='py-2 lg:py-0 lg:mr-6'>
  //       <a href='https://techhelpbd.com' target='blank' className="btn glass text-black">Blog</a>
  //     </li>

  //     <li className='py-2 lg:py-0'>
  //       <NavLink to="/contact" className={({ isActive }) =>
  //         isActive ? "text-white btn btn-primary" : "btn glass text-black"
  //       }>Feedback</NavLink>
  //     </li>
  //     {/* <li className='lg:hidden py-2 lg:py-0'>
  //       <button to="/bteb/developers" className={({ isActive }) =>
  //         isActive ? "text-white btn btn-primary" : "btn glass text-black"
  //       }>Developers</button>
  //     </li> */}
  //   </>
  // )

  return (
    <>
      <header className="border-b-1 relative z-20 w-full border-b border-slate-200 bg-white/90 shadow-lg shadow-slate-700/5 after:absolute after:top-full after:left-0 after:z-10 after:block after:h-px after:w-full after:bg-slate-200 lg:border-slate-200 lg:backdrop-blur-sm lg:after:hidden">
        <div className="relative mx-auto max-w-full px-6">
          <nav
            aria-label="main navigation"
            className="flex lg:inline h-[5.5rem] items-stretch justify-between font-medium text-slate-700"
            role="navigation"
          >


            {/*      <!-- Mobile trigger --> */}
            <button
              className={`relative order-10 block h-10 w-10 self-center lg:hidden
                ${isToggleOpen
                  ? "visible opacity-100 [&_span:nth-child(1)]:w-6 [&_span:nth-child(1)]:translate-y-0 [&_span:nth-child(1)]:rotate-45 [&_span:nth-child(3)]:w-0 [&_span:nth-child(2)]:-rotate-45 "
                  : ""
                }
              `}
              onClick={() => setIsToggleOpen(!isToggleOpen)}
              aria-expanded={isToggleOpen ? "true" : "false"}
              aria-label="Toggle navigation"
            >
              <div className="absolute top-1/2 left-1/2 w-6 -translate-x-1/2 -translate-y-1/2 transform">
                <span
                  aria-hidden="true"
                  className="absolute block h-0.5 w-9/12 -translate-y-2 transform rounded-full bg-slate-900 transition-all duration-300"
                ></span>
                <span
                  aria-hidden="true"
                  className="absolute block h-0.5 w-6 transform rounded-full bg-slate-900 transition duration-300"
                ></span>
                <span
                  aria-hidden="true"
                  className="absolute block h-0.5 w-1/2 origin-top-left translate-y-2 transform rounded-full bg-slate-900 transition-all duration-300"
                ></span>
              </div>
            </button>

           
            <div className='mx-auto flex justify-between items-center max-w-[960px]'>

               {/*      <!-- Brand logo --> */}
              <div>
                <button>
                  <Link to="/" onClick={handleScrollToTop} className="btn btn-ghost normal-case text-lg flex justify-center items-center gap-2 outline-none bg-transparent border-none transition duration-200 active:scale-90"> TechHelpBD <strong className="text-blue-500">|</strong> DownGit</Link>
                </button>
              </div>
              {/*      <!-- Navigation links --> */}
              <div>
                <ul
                  role="menubar"
                  aria-label="Select page"
                  className={`absolute top-0 left-0 z-[-1] h-[28.5rem] w-full justify-center overflow-hidden  overflow-y-auto overscroll-contain bg-white/90 px-8 pb-12 pt-24 font-medium transition-[opacity,visibility] duration-300 lg:visible lg:relative lg:top-0  lg:z-0 lg:flex lg:h-full lg:w-auto lg:items-stretch lg:overflow-visible lg:bg-white/0 lg:px-0 lg:py-0  lg:pt-0 lg:opacity-100 ${isToggleOpen
                    ? "visible opacity-100 backdrop-blur-sm"
                    : "invisible opacity-0"
                    }`}
                >
                  <li role="none" className="flex items-stretch">
                    <NavLink onClick={handleScrollToTop} to="/" className={({ isActive }) =>
                      isActive ? "text-sky-500 flex items-center gap-2 py-4 transition-colors duration-300 focus:outline-none focus-visible:outline-none lg:px-8" : "flex items-center gap-2 py-4 lg:px-8 transition duration-200 active:scale-90"
                    }
                      role="menuitem"
                      aria-haspopup="false"
                      href="javascript:void(0)"
                    >
                      <span className='hidden lg:block'>
                        <HomeIcon />
                      </span>
                      <span className='lg:hidden block'>
                        Home
                      </span>
                    </NavLink>
                  </li>
                  <li role="none" className="flex items-stretch">
                    <a
                      href="https://techhelpbd.com"
                      target='blank'
                      role="menuitem"
                      aria-current="page"
                      aria-haspopup="false"
                      className="flex items-center gap-2 py-4 transition duration-200 active:scale-90"

                    >
                      <span>Blog</span>
                    </a>
                  </li>
                  <li role="none" className="flex items-stretch">
                    <NavLink to="/contact"
                      role="menuitem"
                      aria-haspopup="false"
                      className={({ isActive }) =>
                        isActive ? "text-sky-500 flex items-center gap-2 py-4 transition-colors duration-300 focus:outline-none focus-visible:outline-none lg:px-8" : "flex items-center gap-2 py-4 lg:px-8 transition duration-200 active:scale-90"
                      }

                      href="javascript:void(0)"
                    >
                      <span>Feedback</span>
                    </NavLink>
                  </li>

                </ul>
              </div>
            </div>
          </nav>
        </div>
      </header>
    </>
  )
}
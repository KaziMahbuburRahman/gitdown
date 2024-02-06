import './index.css'
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";

import { useEffect, useState } from 'react';
import "./App.css";
// import Landing from "./components/Landing";
import Preloader from './Preloader.jsx';
import App from './App.jsx';
import Contact from './components/Contact/Contact.jsx';
import { NavbarComponent } from './NavbarComponent.jsx';
import Footer from './Footer.jsx';


const router = createBrowserRouter([
    {
        path: "/gitdown/",
        element:
            <>
                <NavbarComponent />
                <App />
                <Footer />

            </>,
    },

    // {
    //     path: "*",
    //     element: <NotFound />
    // },
    // {
    //     path: "/saved-codes",
    //     element: <SavedCodes />
    // },
    // {
    //     path: "/saved-codes/:index",
    //     element: <SavedCodeEditor />
    // },
    {
        path: "/gitdown/contact",
        element:
            <>
                <NavbarComponent />
                <Contact />
                <Footer />
            </>
    }
]);



function Root() {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }, []);

    // useEffect(() => {
    //     document.addEventListener("contextmenu", (e) => {
    //         e.preventDefault();
    //     });
    // }, []);

    return (
        <>
            {
                loading ? (
                    <Preloader />
                ) :
                    (
                        <>
                            <RouterProvider router={router} />

                        </>
                    )
            }
        </>
    );
}


export default Root;

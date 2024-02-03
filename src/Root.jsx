import ReactDOM from 'react-dom/client'
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
import AdsComponent from './components/AdsComponent.jsx';
import { NavbarComponent } from './NavbarComponent.jsx';


const router = createBrowserRouter([
    {
        path: "/gitdown/",
        element:
            <>
                <NavbarComponent />
                <AdsComponent dataAdSlot="8895719029" />
                <App />

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

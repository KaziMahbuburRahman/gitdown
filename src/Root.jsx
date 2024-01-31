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


const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
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
        path: "/contact",
        element: <Contact />
    }
]);



function Root() {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 1000);
        console.log('rendering');
    }, []);

    useEffect(() => {
        document.addEventListener("contextmenu", (e) => {
            e.preventDefault();
        });
    }, []);

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

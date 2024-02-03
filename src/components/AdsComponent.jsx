import React, { useEffect } from 'react';

const AdsComponent = (props) => {
    const { dataAdSlot } = props;



    // useEffect(() => {

    //     try {
    //         (window.adsbygoogle = window.adsbygoogle || []).push({});
    //         setTimeout(() => { const kazi = document.getElementById("google_esf"); if (kazi == null) { alert("Our website is made possible by displaying online advertisements to our visitors\nPlease consider supporting us by whitelisting our website from your adblocker\n\nℹ Remove our site from your adblocker for better experience"); document.write(""); } }, 8000);
    //     }

    //     catch (e) {

    //     }

    // }, []);



    return (

        <>
            <center className='bg-slate-300'>
                <ins className="adsbygoogle"
                    style={{ display: "block" }}
                    data-ad-client="ca-pub-8519930898536160"
                    data-ad-slot={dataAdSlot}
                    data-ad-format="auto"
                    data-full-width-responsive="true">
                </ins>
            </center>

        </>
    );
};

export default AdsComponent;
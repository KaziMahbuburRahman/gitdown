import { useRef, useState } from 'react'
import './Contact.css'
import emailjs from '@emailjs/browser';


const Contact = () => {
    const [successMessage, setSuccessMessage] = useState(false);


    const form = useRef(null);
    const sendEmail = (e) => {
        e.preventDefault();
        emailjs.sendForm('service_w2rs66a', 'template_ku5pa29', form.current, 'DpIxhGCf5pshat00K')
        // .then((result) => {
        //     // console.log(result.text);
        // }, (error) => {
        //     // console.log(error.text);
        // });

        // toast.success("Thanks for your Feedback!", {
        //     position: "top-right",
        //     autoClose: 2000,
        //     hideProgressBar: true,
        //     closeOnClick: true,
        //     pauseOnHover: true,
        //     draggable: true,
        //     progress: undefined,
        // });

        form.current.reset();
        setSuccessMessage(true);
    };

    return (
        <>


            {/* 
            <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            /> */}

            <div className="bg-no-repeat  mx-5 bg-cover contact-container bg-black bg-blend-darken">
                <div className="h-[100vh] rounded-md bg-img-overlay pt-12 pb-20">
                    <div className="text-center text-white py-12 space-y-2 ">
                        <h2 className='text-3xl lg:text-4xl font-bold font-mono '>Contact Our Team</h2>
                        <h3 className=''>Have any questions ? <br className='lg:hidden' />
                            We love to hear from you .</h3>
                    </div>
                    <div className="flex flex-col justify-center items-center container mx-auto px-8 gap-6">

                        <form ref={form} onSubmit={sendEmail} className="max-w-[700px] space-y-2 p-5 bg-base-100 rounded-lg">

                            <input
                                required
                                type="text"
                                name="from_name"
                                placeholder='Enter your name'
                                className='w-full border rounded-lg py-2 text-lg pl-3 hover:border-primary duration-300'
                            />



                            <input
                                required
                                type="email"
                                name="user_email"
                                placeholder='Enter your email'
                                className='w-full border rounded-lg py-2 text-lg pl-3 hover:border-primary duration-300'
                            />


                            <input
                                required
                                type="text"
                                name="mail_subject"
                                placeholder='Enter your Subject'
                                className='w-full border rounded-lg py-2 text-lg pl-3 hover:border-primary duration-300'
                            />


                            <textarea
                                type="text"
                                name="message"
                                rows={4}
                                placeholder='Write your message'
                                className='w-full text-black border rounded-lg py-1 text-xl pl-3 hover:border-primary duration-300'
                            />



                            <button
                                className='px-5 py-3  border bg-primary duration-300 hover:bg-[#6f49c7] rounded-lg text-lg w-full text-white'
                                type='submit'
                                name='submit'
                            >
                                Submit Now
                            </button>

                        </form>

                        {/* Message Sent confirmation */}
                        {
                            successMessage && <div
                                className="flex max-w-[657px] bg-base-100 items-start gap-4 rounded border border-emerald-100 bg-emerald-50 px-2 py-3 text-sm text-emerald-500"
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
                                    aria-labelledby="title-06 desc-06"
                                >
                                    <title id="title-06">Icon title</title>
                                    <desc id="desc-06">A more detailed description of the icon</desc>
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                {/*  <!-- Text --> */}
                                <div>
                                    <h3 className="mb-2 font-semibold">
                                        Message Sent Successfully!
                                    </h3>
                                    <p>
                                        Thanks for your feedback{" "}
                                    </p>
                                </div>
                            </div>
                        }
                    </div>

                </div>
            </div>

        </>
    )
}

export default Contact
import { useRef, useState } from 'react'
import './Contact.css'
import emailjs from '@emailjs/browser';
import { NavbarComponent } from '../../NavbarComponent';
import Footer from '../../Footer';
// import ThemeChanger from '../../shared/ThemeChanger/ThemeChanger';
// import { ToastContainer, toast } from 'react-toastify';

const Contact = () => {
    const [isModalOpen, setModalOpen] = useState(false);
    const openModal = () => {
        setModalOpen(true);
    }
    const closeModal = () => {
        setModalOpen(false);
    }
    const [daisyTheme, setDaisyTheme] = useState('');

    const form = useRef(null);
    const sendEmail = (e) => {
        e.preventDefault();
        emailjs.sendForm('service_w2rs66a', 'template_ku5pa29', form.current, 'DpIxhGCf5pshat00K')
            .then((result) => {
                console.log(result.text);
            }, (error) => {
                console.log(error.text);
            });

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
    };

    return (
        <>
            <NavbarComponent openModal={openModal} />
            <ThemeChanger isModalOpen={isModalOpen} closeModal={closeModal} daisyTheme={daisyTheme} setDaisyTheme={setDaisyTheme} />
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

            <div className="bg-no-repeat bg-cover contact-container bg-black bg-blend-darken">
                <div className="h-[100vh] bg-img-overlay pt-12 pb-20">
                    <div className="text-center text-white py-12 space-y-2 ">
                        <h2 className='text-3xl lg:text-4xl font-bold font-mono '>Contact Our Team</h2>
                        <h3 className=''>Have any questions ? <br className='lg:hidden' />
                            We love to hear from you .</h3>
                    </div>
                    <div className="flex flex-col justify-center  lg:flex-row container mx-auto px-8 gap-6">

                        <form ref={form} onSubmit={sendEmail} className="lg:w-1/2 space-y-2 p-5 bg-base-100 rounded-lg">

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


                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default Contact
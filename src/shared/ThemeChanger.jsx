import { useEffect } from "react";
import { themeOptions } from "./data";
import styles from "./ThemeChanger.module.css";


export default function ThemeChanger({ daisyTheme, setDaisyTheme, isModalOpen, closeModal }) {
    const handleThemeChange = (e) => {
        setDaisyTheme(e.target.value);
        window.localStorage.setItem("theme", e.target.value);
        window.location.reload();
    };
    useEffect(() => {
        /* Sets the data-theme attribute on html tag */
        document.querySelector('html').setAttribute('data-theme', window.localStorage.getItem('theme'));

    }, [daisyTheme]);

    return (
        <>
            {
                isModalOpen ? <div>
                    <input type="checkbox" id="themeChanger" className="modal-toggle" />
                    <div className="modal modal-bottom sm:modal-middle">
                        <div className="modal-box relative">
                            <h3 className="text-lg font-bold flex items-center gap-1">

                                <i className={`bx bx-cog text-lg ${styles.themeBtn}`}></i>Choose
                                your theme from here
                            </h3>
                            <div className="name border rounded p-3 relative mt-10">
                                <div className="name-title absolute -top-4 bg-base-100 border rounded p-1">
                                    <h3 className="text-xs font-poppins">Theme Chooser</h3>
                                </div>
                                <div className="input-group flex items-center my-2 border p-3 rounded-md mt-2 max-w-md overflow-hidden">
                                    <div className="icon">
                                        <i className="bx bxs-hot"></i>
                                    </div>
                                    <select
                                        className="select w-full focus:outline-none max-w-sm md:ml-2 capitalize"
                                        name="theme"
                                        onChange={handleThemeChange}
                                        value={daisyTheme}
                                    >
                                        <option disabled value="">
                                            Choose your theme
                                        </option>
                                        {themeOptions.map((option) => (
                                            <option key={option.value} value={option.value}>{option.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="pt-3 font-semibold">
                                <p>
                                    Current theme:{" "}
                                    <span className="capitalize btn btn-xs btn-primary cursor-default no-animation text-white">
                                        {daisyTheme ? daisyTheme : "Light"}
                                    </span>
                                </p>
                            </div>

                            <div onClick={closeModal} className="modal-action">
                                <label htmlFor="themeChanger" className="btn btn-error text-white">
                                    <i className="bx bx-x text-xl"></i> Close
                                </label>
                            </div>
                        </div>
                    </div>
                </div> : null
            }
        </>
    );
}
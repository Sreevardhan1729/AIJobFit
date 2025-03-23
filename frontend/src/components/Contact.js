import React from "react";
import { ReactComponent as GitHubIcon } from '../svgs/github.svg';
import { ReactComponent as LeetcodeIcon } from '../svgs/leetcode.svg';
import { ReactComponent as InstagramIcon } from '../svgs/instagram.svg';
import { ReactComponent as LinkedinIcon } from '../svgs/linkedin.svg';

const Contact = () => {
    const handleScroll = () => {
        document.getElementById("home").scrollIntoView({ behavior: "smooth" });
      };
    return (
        <section id="contact" className="text-gray-600 body-font relative mt-16">
            <div className="container px-5 py-16 mx-auto">
                <div className="flex flex-col text-center w-full mb-12">
                    <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">Contact Me</h1>
                    <p className="lg:w-2/3 mx-auto leading-relaxed text-base">Feel free to reach out for any inquiries or collaborations.</p>
                </div>
                <div className="lg:w-1/2 md:w-2/3 mx-auto">
                    <div className="flex flex-wrap -m-2">
                        
                        {/* Name Input */}
                        <div className="p-2 w-1/2">
                            <div className="relative">
                                <label htmlFor="name" className="leading-7 text-sm text-gray-600">Name</label>
                                <input 
                                    type="text" 
                                    id="name" 
                                    name="name" 
                                    className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-2 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                />
                            </div>
                        </div>

                        {/* Email Input */}
                        <div className="p-2 w-1/2">
                            <div className="relative">
                                <label htmlFor="email" className="leading-7 text-sm text-gray-600">Email</label>
                                <input 
                                    type="email" 
                                    id="email" 
                                    name="email" 
                                    className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-2 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                />
                            </div>
                        </div>

                        {/* Message Textarea */}
                        <div className="p-2 w-full">
                            <div className="relative">
                                <label htmlFor="message" className="leading-7 text-sm text-gray-600">Message</label>
                                <textarea 
                                    id="message" 
                                    name="message" 
                                    className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-2 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
                                ></textarea>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="p-2 w-full">
                            <button className="flex mx-auto text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg" onClick={handleScroll}>
                                Send Message
                            </button>
                        </div>

                        {/* Contact Details */}
                        <div className="p-2 w-full pt-8 mt-8 border-t border-gray-200 text-center">
                            <a href="itssreevardhan@gmail.com" className="text-indigo-500">itssreevardhan@gmail.com</a>
                            <p className="leading-normal my-5">An AI-Powered Job Tool by Sree Vardhan<br /> India</p>

                            {/* Social Icons */}
                            <span className="inline-flex">
                                {/* GitHub Icon */}
                                <a className="text-gray-500" href="https://github.com/Sreevardhan1729" target="_blank" rel="noopener noreferrer">
                                <GitHubIcon className="w-5 h-5" />
                                </a>

                                {/* Instagram Icon */}
                                <a className="ml-4 text-gray-500" href="https://leetcode.com/u/Vardhan1729/" target="_blank" rel="noopener noreferrer">
                                    <LeetcodeIcon className="w-5 h-5" />
                                </a>

                                {/* LeetCode Icon */}
                                <a className="ml-4 text-gray-500" href="https://www.instagram.com/sreevardhan1729" target="_blank" rel="noopener noreferrer">
                                    <svg fill="currentColor" className="w-5 h-5" viewBox="0 0 24 24">
                                    <InstagramIcon className="w-5 h-5" />
                                    </svg>
                                </a>

                                {/* LinkedIn Icon */}
                                <a className="ml-4 text-gray-500" href="https://www.linkedin.com/in/sreevardhanreddy/" target="_blank" rel="noopener noreferrer">
                                    <LinkedinIcon className="w-5 h-5" />
                                </a>
                                </span>

                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;



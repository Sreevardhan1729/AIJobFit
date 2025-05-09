import React from "react";

const Navbar = () => {
    return (
        <header className="text-gray-600 body-font bg-white shadow-md h-16 flex items-center fixed top-0 w-full z-50">
            <div className="container mx-auto flex justify-between items-center px-6">
                <a href="#home" className="flex title-font font-medium items-center text-gray-900">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full" viewBox="0 0 24 24">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                    </svg>
                    <span className="ml-3 text-xl">AIJobFit</span>
                </a>

                {/* Navigation Links */}
                <nav className="flex space-x-6">
                    <a href="#home" className="text-gray-600 hover:text-black transition duration-300 no-underline">Home</a>
                    <a href="#features" className="text-gray-600 hover:text-black transition duration-300 no-underline">Features</a>
                    <a href="#contact" className="text-gray-600 hover:text-black transition duration-300 no-underline">Contact Me</a>
                </nav>

                <button className="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base">
                    Login ?
                    <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 ml-1" viewBox="0 0 24 24">
                        <path d="M5 12h14M12 5l7 7-7 7"></path>
                    </svg>
                </button>
            </div>
        </header>
    );
};

export default Navbar;

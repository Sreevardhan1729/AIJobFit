import React from "react";
import { ReactComponent as GitHubIcon } from "../svgs/github.svg";
import { ReactComponent as LeetcodeIcon } from "../svgs/leetcode.svg";
import { ReactComponent as InstagramIcon } from "../svgs/instagram.svg";
import { ReactComponent as LinkedinIcon } from "../svgs/linkedin.svg";

export default function Contact() {
  const handleScroll = () => {
    document.getElementById("home")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="contact" className="relative mt-16 text-gray-600">
      <div className="container mx-auto px-5 py-16">
        <div className="mb-12 flex w-full flex-col text-center">
          <h1 className="mb-4 text-2xl font-medium text-gray-900 sm:text-3xl">Contact Me</h1>
          <p className="mx-auto text-base leading-relaxed lg:w-2/3">
            Feel free to reach out for any inquiries or collaborations.
          </p>
        </div>
        <div className="mx-auto md:w-2/3 lg:w-1/2">
          <div className="-m-2 flex flex-wrap">
            <div className="w-1/2 p-2">
              <div className="relative">
                <label htmlFor="name" className="text-sm leading-7 text-gray-600">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full rounded border border-gray-300 bg-gray-100 bg-opacity-50 px-3 py-2 text-base leading-8 text-gray-700 outline-none transition-colors duration-200 ease-in-out focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200"
                />
              </div>
            </div>
            <div className="w-1/2 p-2">
              <div className="relative">
                <label htmlFor="email" className="text-sm leading-7 text-gray-600">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full rounded border border-gray-300 bg-gray-100 bg-opacity-50 px-3 py-2 text-base leading-8 text-gray-700 outline-none transition-colors duration-200 ease-in-out focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200"
                />
              </div>
            </div>
            <div className="w-full p-2">
              <div className="relative">
                <label htmlFor="message" className="text-sm leading-7 text-gray-600">Message</label>
                <textarea
                  id="message"
                  name="message"
                  className="h-32 w-full resize-none rounded border border-gray-300 bg-gray-100 bg-opacity-50 px-3 py-2 text-base leading-6 text-gray-700 outline-none transition-colors duration-200 ease-in-out focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200"
                />
              </div>
            </div>
            <div className="w-full p-2">
              <button
                className="mx-auto flex rounded bg-indigo-500 px-8 py-2 text-lg text-white hover:bg-indigo-600 focus:outline-none"
                onClick={handleScroll}
              >
                Send Message
              </button>
            </div>
            <div className="mt-8 w-full border-t border-gray-200 p-2 pt-8 text-center">
              <a href="mailto:itssreevardhan@gmail.com" className="text-indigo-500">
                itssreevardhan@gmail.com
              </a>
              <p className="my-5 leading-normal">
                An AI-Powered Job Tool by Sree Vardhan
                <br />
                India
              </p>
              <span className="inline-flex">
                <a className="text-gray-500" href="https://github.com/Sreevardhan1729" target="_blank" rel="noopener noreferrer">
                  <GitHubIcon className="h-5 w-5" />
                </a>
                <a className="ml-4 text-gray-500" href="https://leetcode.com/u/Vardhan1729/" target="_blank" rel="noopener noreferrer">
                  <LeetcodeIcon className="h-5 w-5" />
                </a>
                <a className="ml-4 text-gray-500" href="https://www.instagram.com/sreevardhan1729" target="_blank" rel="noopener noreferrer">
                  <InstagramIcon className="h-5 w-5" />
                </a>
                <a className="ml-4 text-gray-500" href="https://www.linkedin.com/in/sreevardhanreddy/" target="_blank" rel="noopener noreferrer">
                  <LinkedinIcon className="h-5 w-5" />
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

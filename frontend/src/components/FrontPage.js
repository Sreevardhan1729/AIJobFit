import FrontImage from "../images/FrontPage.png"
const FrontPage = () => {
  const handleScroll = () => {
    document.getElementById("features").scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="home" className="text-gray-600 body-font pt-32">
      <div className="max-w-screen-xl mx-auto flex px-10 py-32 md:flex-row flex-col items-center">
        <div className="lg:flex-grow md:w-1/2 lg:pr-32 md:pr-20 flex flex-col text-left mb-16 md:mb-0">
          <h1 className="title-font sm:text-5xl text-4xl mb-6 font-bold text-gray-900">
            Empowering Your Job Search with AI
          </h1>
          <p className="mb-10 leading-relaxed text-lg">
            Find out how well your resume matches a job description in seconds! Our AI-powered tool analyzes job postings, compares them with your resume, and highlights missing skills—helping you land the right job faster.
          </p>
          <div className="flex">
            <button
              onClick={handleScroll}
              className="inline-flex text-white bg-indigo-500 border-0 py-3 px-8 text-lg font-semibold rounded-lg shadow-lg hover:bg-indigo-600 transition"
            >
              Get Started
            </button>
          </div>
        </div>
        <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6">
          <img
            className="object-cover object-center rounded-lg w-full h-auto shadow-lg"
            alt="hero"
            src={FrontImage}
          />
        </div>
      </div>
    </section>
  );
};

export default FrontPage;

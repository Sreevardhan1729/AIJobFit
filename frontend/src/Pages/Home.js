
import FrontPage from "../components/FrontPage";
import "../index.css"
import Navbar from "../components/Navbar";
import Features from "../components/Features";
import SelectBut from "../components/SelectBut";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
const Home = () => {

    return (
        <div>
          <Navbar />
            <FrontPage />
            <SelectBut />
            <Features />
            <Contact />
            <Footer />

        </div>
    )
}
export default Home
import Header from "../../components/Header/Header.tsx";
import Banner from '../../components/Banner/Banner.tsx';
import styles from "../../components/AboutUs/AboutUs.module.css";

const Homepage = () => {
    return (
        <div className="paginaContainer">
        <Header/>
        <Banner/>
        </div>
    );
};

export default Homepage;
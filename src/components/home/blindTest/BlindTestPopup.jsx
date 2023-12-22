import ArrowBack from "../../../assets/icon/play.svg";
import { Link } from "react-router-dom";
import "./BlindTestPopup.scss";

const Home = () => {
    return (
        <>
            <div className="blindtest-wrapper">
                <h2>Want to play a blind test?</h2>
                <Link to="/blindtest">
                    <img src={ArrowBack} alt="Icone Arrow" />
                </Link>
                <p>Click on the button to have fun 😎</p>
            </div>
        </>
    );
};
export default Home;
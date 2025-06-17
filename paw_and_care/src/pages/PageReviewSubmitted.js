import Header from '../components/header';
import Footer from '../components/footer';
import greentick from '../assets/SVG/greentick.png'
import { Link } from "react-router-dom";
import './PageRequestSuccess.css'

const PageReviewSubmitted = () => {

    return (
        <div>
            <Header />
            <div className="content">
                <div className="content-container">
                    <img src={greentick} alt="tick-circle" />
                    <h3> Thank you for your review!</h3>
                </div>
                <div className={"buttons-container"}>
                    <Link to={"/"}><button className={"appointment-back-home"}>Back Home</button></Link>
                </div>
            </div>
            <Footer />
        </div>
    );

};

export default PageReviewSubmitted;
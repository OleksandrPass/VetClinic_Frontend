import greentick from '../assets/SVG/greentick.png'
import { Link } from "react-router-dom";
import './PageRequestSuccess.css'

const PageReviewSubmitted = () => {

    return (
        <div>
            <div className="content">
                <div className="content-container">
                    <img src={greentick} alt="tick-circle" />
                    <h3> Thank you for your review!</h3>
                </div>
                <div className={"buttons-container"}>
                    <Link to={"/"}><button className={"appointment-back-home"}>Back Home</button></Link>
                </div>
            </div>
        </div>
    );

};

export default PageReviewSubmitted;
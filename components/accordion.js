import { useState } from "react";

export default function Accordion({ children, title }) {
    const [isShowing, setIsShowing] = useState(false);

    const toggle = () => {
        setIsShowing(!isShowing);
    };

    return (
        <div
            className={isShowing ? "accordion active" : "accordion"}
        >
            <button
                onClick={toggle}
                type="button"
            >
                {title}   <i className={isShowing ? "fa fa-chevron-up   fa-3x fa-fw" : "fa fa-chevron-right   fa-3x fa-fw"}></i>
            </button>
            <div
                style={{ padding: "5px" }}
                className="body"
            >{children}</div>
            <style jsx>{` 
 
.accordion {background-color:var(--bg-card-color);margin-top:15px;border-radius:5px;} 
.accordion button{font-size:16px;width:100%;background-color:transparent;border:none;color:white;text-align:left;position:relative;padding:15px 15px;display:block;}
.accordion button .fa{position:absolute;right:15px;}
.accordion .body{padding:15px;border-top:solid 1px rgba(255 255 255  / 5%);display:none;}
.accordion.active .body{display:block}
.accordion * {font-size:13px;}



 
    `}</style>
        </div>
    );
}

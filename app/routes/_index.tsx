import me from "../images/bwCropped.jpg";
import fgf from "../images/findGiftsFor.png";
import fofo from "../images/fofo.png";
import { Link } from "@remix-run/react";
import "@fontsource/lato/700.css";

export default function Index() {
  return (
    <div className="wrapper">
      <h1>Matt Corwin</h1>
      <div className="polaroid">
        <img
          className="rounded-image"
          src={me}
          alt="Person standing in front of a tree"
        />
      </div>
      <div className="polaroid">
        <Link to="https://www.findgiftsfor.com/" prefetch="render">
          <img
            className="rounded-image"
            src={fgf}
            alt="Gift search website with robot"
          />
        </Link>
      </div>
      <div className="polaroid">
        <Link to="https://www.falofofo.com/" prefetch="render">
          <img
            className="rounded-image"
            src={fofo}
            alt="Language learning website with rabbit"
          />
        </Link>
      </div>
    </div>
  );
}

const WHYUS = [
  {
    img: "/images/why/why-icon1.webp",
    title: "100 % Organic",
    subTitle: "Duis aute irure dolor in reprehenderit in voluptate velit",
  },
  {
    img: "/images/why/why-icon2.webp",
    title: "Best Quality",
    subTitle: "Duis aute irure dolor in reprehenderit in voluptate velit",
  },
  {
    img: "/images/why/why-icon3.webp",
    title: "Hygienic Product",
    subTitle: "Duis aute irure dolor in reprehenderit in voluptate velit",
  },
  {
    img: "/images/why/why-icon4.webp",
    title: "Health Care",
    subTitle: "Duis aute irure dolor in reprehenderit in voluptate velit",
  },
];

const WHYTEXT = [
  "Quis nostrud was exercitation.",
  "Quis nostrud was exercitation.",
  "Quis nostrud was exercitation.",
  "Quis nostrud was exercitation.",
];

export const Why = () => (
  <div className="ayur-bgcover ayur-why-sec">
    <div className="container">
      <div className="row">
        <div className="col-lg-12 col-md-12 col-sm-12">
          <div className="ayur-heading-wrap ayur-why-head">
            <h5>Best For You</h5>
            <h3>Why Pure Ayurveda</h3>
          </div>
        </div>
      </div>
      <div className="row align-items-center">
        <div className="col-lg-6 col-md-12 col-sm-12">
          <div className="ayur-why-secbox">
            {WHYUS.map((why, index) => (
              <div key={index} className="ayur-why-box">
                <div className="ayur-why-boxicon">
                  <img src={why.img} alt="icon" />
                </div>
                <div className="ayur-why-boxtext">
                  <h4>{why.title}</h4>
                  <p>{why.subTitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="col-lg-6 col-md-12 col-sm-12">
          <div className="ayur-why-textheading">
            <h3>Solve Your Problem with The Power of Nature</h3>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit,it's sed
              do eiusmod tempor incididunt ut labore et dolore was a magna
              aliqua.Ut enim ad minim veniam,quis nostrud exercitation that is
              ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute
              irure dolor in to reprehenderit in voluptate velit esse cillum
              dolore eu fugiat nulla pariatur.
            </p>
            <ul>
              {WHYTEXT.map((text, index) => (
                <li key={index}>
                  <img src="/images/tick.webp" alt="icon" />
                  <p>{text}</p>
                </li>
              ))}
            </ul>
            <p>
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur.
            </p>
            <div className="ayur-why-btn">
              <a href="services.html" className="ayur-btn">
                Read More
              </a>
            </div>
          </div>
        </div>
        {/* <div className="col-lg-12 col-md-12 col-sm-12">
          <div className="ayur-video-section">
            <div className="ayur-video-img">
              <img src="/images/video-bg.webp" alt="img" />
              <a
                href="javascript:void(0)"
                className="ayur-video-playicon"
                id="popup"
              >
                <img src="/images/play-icon.svg" alt="icon" />
              </a>
              <div id="videoPopup1" className="ayur-popup">
                <div className="ayur-popup-content">
                  <span className="close" id="close">
                    ×
                  </span>
                  <iframe
                    src="https://www.youtube.com/embed/tw8amX5GdBI?si=PjyEnFipiFOXBXck" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin"
                    frameBorder="0"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
    <div className="ayur-bgshape ayur-why-bgshape">
      <img src="/images/bg-shape4.webp" alt="img" />
      <img src="/images/bg-leaf4.webp" alt="img" />
    </div>
  </div>
);

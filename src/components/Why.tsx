const WHYUS = [
  {
    img: "/images/why/why-icon1.webp",
    title: "100 % Organic",
    subTitle: "Sourced from natural herbs and plants, free from harmful chemicals",
  },
  {
    img: "/images/why/why-icon2.webp",
    title: "Best Quality",
    subTitle: "Crafted with strict quality checks to ensure purity in every product",
  },
  {
    img: "/images/why/why-icon3.webp",
    title: "Hygienic Product",
    subTitle: "Manufactured in a clean, controlled environment for your safety",
  },
  {
    img: "/images/why/why-icon4.webp",
    title: "Health Care",
    subTitle: "Formulated to support long-term wellness, not just quick relief",
  },
];

const WHYTEXT = [
  "Authentic Ayurvedic formulations",
  "100% natural and herbal ingredients",
  "No harmful chemicals or additives",
  "Trusted by customers for over 10 years",
];

export const Why = () => (
  <div className="ayur-bgcover ayur-why-sec">
    <div className="container">
      <div className="row">
        <div className="col-lg-12 col-md-12 col-sm-12">
          <div className="ayur-heading-wrap ayur-why-head">
            <h5>Best For You</h5>
            <h3>Why Parampara Divya Ayurved</h3>
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
              At Parampara Divya Ayurved, we believe true healing comes from nature. Every product we craft draws on time-tested Ayurvedic knowledge, combined with modern manufacturing standards, to bring you remedies that are safe, effective, and free from harmful side effects. Whether you're looking to manage a specific health concern or simply improve your everyday wellbeing, our formulations are designed to work with your body, not against it.
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
              From our manufacturing unit in Meghauli, Chitwan, to households across Nepal, we remain committed to delivering Ayurvedic
              solutions rooted in tradition and backed by consistent quality, so you can trust what you put into your body.
            </p>
            <div className="ayur-why-btn">
              <a href="/services" className="ayur-btn">
                Read More
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="ayur-bgshape ayur-why-bgshape">
      <img src="/images/bg-shape4.webp" alt="img" />
      <img src="/images/bg-leaf4.webp" alt="img" />
    </div>
  </div>
);

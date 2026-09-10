import { CONTACTS, LOCATIONS, NAVLINKS } from "@/constants";

export const Footer = () => (
  <div className="ayur-footer-section">
    <div className="container">
      <div className="ayur-footer-sec">
        <div className="row">
          <div className="col-lg-5 col-md-6 col-sm-6">
            <div className="ayur-footer-logosec">
              <div className="ayur-footer-logo">
                <img src="/images/logo.webp" alt="logo" />
              </div>
              <p>
                Parampara Divya Ayurved Udhyog brings you authentic Ayurvedic
                products crafted with traditional wisdom and natural
                ingredients, dedicated to your health and wellbeing.
              </p>
              <ul className="ayur-social-link">
                <li>
                  <a href="https://www.facebook.com/profile.php?id=61593331822517" target="_blank">
                    <svg
                      width="11"
                      height="20"
                      viewBox="0 0 11 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6.74157 20V10.8777H9.80231L10.2615 7.32156H6.74157V5.05147C6.74157 4.0222 7.02622 3.32076 8.50386 3.32076L10.3854 3.31999V0.13923C10.06 0.0969453 8.94308 0 7.64308 0C4.92848 0 3.07002 1.65697 3.07002 4.69927V7.32156H0V10.8777H3.07002V20H6.74157Z"
                        fill="#E4D4CF"
                      />
                    </svg>
                  </a>
                </li>
                <li>
                  <a href="https://www.tiktok.com/@parampara.divya.a" target="_blank">
                    <svg
                      width="18"
                      height="20"
                      viewBox="0 0 18 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M13.7844 0H10.4304V13.6444C10.4304 15.2444 9.16522 16.5556 7.59565 16.5556C6.02609 16.5556 4.76087 15.2444 4.76087 13.6444C4.76087 12.0733 5.99565 10.7911 7.5087 10.7333V7.35556C4.15652 7.41333 1.43478 10.1889 1.43478 13.6444C1.43478 17.1289 4.18696 20 7.5087 20C10.8304 20 13.5826 17.1 13.5826 13.6444V6.66667C14.8478 7.6 16.3913 8.15556 18 8.18333V4.80556C15.6435 4.72222 13.7844 2.75556 13.7844 0.324889V0Z"
                        fill="#E4D4CF"
                      />
                    </svg>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 col-sm-6">
            <div className="ayur-footer-box">
              <h4>Useful Links</h4>
              <ul className="ayur-links">
                {NAVLINKS.map((link, index) => (
                  <li key={index}>
                    <a href={link.href}>{link.name}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="col-lg-4 col-md-6 col-sm-6">
            <div className="ayur-footer-box">
              <h4>Contact Info</h4>
              <ul className="ayur-contact-list">
                {LOCATIONS.map((location, index) => (
                  <li key={index} className="ayur-contact-box">
                    <img src="/images/location.webp" alt="icon" />
                    <p>
                      <strong>{location.label}:</strong>
                      <br />
                      {location.address}
                    </p>
                  </li>
                ))}
                {CONTACTS.map((info, index) => (
                  <li key={index} className="ayur-contact-box">
                    <img src={info.img} alt="icon" />
                    <p>{info.value}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
          <div className="ayur-copyright-para">
            <p>
              Copyright © {new Date().getFullYear()}. All Right Reserved. Parampara Divya Ayurved
              <span className="ayur-credit-sep"> | </span>
              Crafted by{" "}
              <a
                href=""
                // target="_blank"
                rel="noopener noreferrer"
                className="ayur-credit-link"
              >
                ORBIXXANO
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
    <div className="ayur-bgshape ayur-footer-bgshape">
      <img src="/images/footer/footer-left.webp" alt="img" />
      <img src="/images/footer/footer-right.webp" alt="img" />
    </div>
  </div>
);
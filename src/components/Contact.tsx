export const Contact = () => (
  <div className="ayur-bgcover ayur-contactpage-wrapper">
    <div className="container">
      <div className="ayur-contactpage-box">
        <div className="ayur-contact-map">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3531.894235842704!2d85.36133587423706!3d27.720551624911174!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb197bd3686a41%3A0xbaad8e64eb67d9eb!2sParampara%20Divya%20Ayurvedic%20%7C%20Ayurvedic%20Clinic%20in%20Boudha%2C%20Kathmandu!5e0!3m2!1sen!2snp!4v1788407150239!5m2!1sen!2snp"
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
        <div className="ayur-contact-pageinfo">
          <div className="ayur-contact-heading">
            <h3>Get in touch with us</h3>
            <p>
              Have a question about our products or services? Reach out to
              us and our team will get back to you as soon as possible.
            </p>
          </div>
          <div className="ayur-contact-form-wrapper">
            <form method="" className="ayur-contact-form">
              <div className="row">
                <div className="col-lg-6 col-md-6 col-sm-6">
                  <div className="ayur-form-input">
                    <input
                      type="text"
                      className="form-control require"
                      placeholder="First Name"
                    />
                  </div>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-6">
                  <div className="ayur-form-input">
                    <input
                      type="text"
                      className="form-control require"
                      placeholder="Last Name"
                    />
                  </div>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-6">
                  <div className="ayur-form-input">
                    <input
                      type="text"
                      className="form-control require"
                      name="email"
                      placeholder="Your Email"
                      data-valid="email"
                      data-error="Email should be valid."
                    />
                  </div>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-6">
                  <div className="ayur-form-input">
                    <input
                      type="text"
                      className="form-control require"
                      placeholder="Subject"
                    />
                  </div>
                </div>
                <div className="col-lg-12 col-md-12">
                  <div className="ayur-form-input">
                    <textarea
                      name="your-message"
                      cols={3}
                      rows={8}
                      className="form-control require"
                      placeholder="Your Message..."
                    />
                  </div>
                </div>
                <div className="col-lg-12 col-md-12">
                  <button
                    type="button"
                    className="ayur-btn ayur-con-btn submitForm"
                  >
                    Send Message
                  </button>
                  <div className="response" />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
);
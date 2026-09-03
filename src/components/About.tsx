interface AboutProps {
  marginTopValue?: string | number;
}

export const About = ({ marginTopValue }: AboutProps) => (
    <div className="ayur-bgcover ayur-about-sec" style={{ marginTop: marginTopValue }}>
        <div className="container">
            <div className="row">
                <div className="col-lg-6 col-md-12 col-sm-12">
                    <div className="ayur-about-img">
                        <img src="/images/about-img.webp" alt="img" data-tilt data-tilt-max="10" data-tilt-speed="1000" data-tilt-perspective="1000" />
                        <div className="ayur-about-exp">
                            <p>10</p>
                            <p>Years of Experience</p>
                        </div>
                    </div>
                </div>
                <div className="col-lg-6 col-md-12 col-sm-12">
                    <div className="ayur-heading-wrap ayur-about-head">
                        <h5>Who We Are</h5>
                        <h3>The Natural Way To Achieving Balance And Optimal Health</h3>
                        <p>Parampara Divya Ayurved Udhyog blends age-old Ayurvedic tradition with modern quality standards to bring you authentic, natural wellness solutions. With over 10 years of experience and a dedicated manufacturing unit in Meghauli, Chitwan, we craft every product with care and purity. Reach us at our Kathmandu office in Pipalbot, Boudha, for consultations and support on your journey to holistic health.</p>
                        {/* <a href="about.html" className="ayur-btn">Know More</a> */}
                    </div>
                </div>
            </div>
        </div>
        <div className="ayur-bgshape ayur-about-bgshape">
            <img src="/images/bg-shape2.webp" alt="img" />
            <img src="/images/bg-leaf2.webp" alt="img" />
        </div>
    </div>
);
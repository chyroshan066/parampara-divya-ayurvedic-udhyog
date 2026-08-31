const ACHIEVEMENTS = [
    {
        img: "/images/achievements/achieve-icon1.webp",
        achievementValue: "25",
        achievementTitle: "Years Experience",
    },
    {
        img: "/images/achievements/achieve-icon2.webp",
        achievementValue: "60 +",
        achievementTitle: "Happy Customers",
    },
    {
        img: "/images/achievements/achieve-icon3.webp",
        achievementValue: "800 +",
        achievementTitle: "Our Products",
    },
    {
        img: "/images/achievements/achieve-icon4.webp",
        achievementValue: "100%",
        achievementTitle: "Product Purity",
    },
];

export const Achievement = () => (
    <div className="ayur-bgcover ayur-achievement-sec">
        <div className="container">
            <div className="row  align-items-center">
                <div className="col-lg-4 col-md-12 col-sm-12">
                    <div className="ayur-heading-wrap ayur-heading-left">
                        <h5>Our Recent Achievements</h5>
                        <h3>Benefit From Choosing The Best</h3>
                    </div>
                </div>
                <div className="col-lg-8 col-md-12 col-sm-12">
                    <div className="ayur-achieve-box-wrapper">
                        {/* <div className="ayur-achieve-box">
                            <div className="ayur-achieve-icon">
                                <img src="assets/images/achieve-icon1.png" alt="icon" />
                            </div>
                            <div className="ayur-achieve-text">
                                <h2 className="ayur-counting" data-to="25">25</h2>
                                <p>Years Experience</p>
                            </div>
                        </div>
                        <div className="ayur-achieve-box">
                            <div className="ayur-achieve-icon">
                                <img src="assets/images/achieve-icon2.png" alt="icon" />
                            </div>
                            <div className="ayur-achieve-text">
                                <h2 className="ayur-counting" data-to="60">60 +</h2>
                                <p>Happy Customers</p>
                            </div>
                        </div>
                        <div className="ayur-achieve-box">
                            <div className="ayur-achieve-icon">
                                <img src="assets/images/achieve-icon3.png" alt="icon" />
                            </div>
                            <div className="ayur-achieve-text">
                                <h2 className="ayur-counting" data-to="800">800 +</h2>
                                <p>Our Products</p>
                            </div>
                        </div>
                        <div className="ayur-achieve-box">
                            <div className="ayur-achieve-icon">
                                <img src="assets/images/achieve-icon4.png" alt="icon" />
                            </div>
                            <div className="ayur-achieve-text">
                                <h2 className="ayur-counting percent" data-to="100%">100%</h2>
                                <p>Product Purity</p>
                            </div>
                        </div> */}
                        {ACHIEVEMENTS.map((achievement, index) => (
                            <div key={index} className="ayur-achieve-box">
                            <div className="ayur-achieve-icon">
                                <img src={achievement.img} alt="icon" />
                            </div>
                            <div className="ayur-achieve-text">
                                <h2 className="ayur-counting" data-to="25">{achievement.achievementValue}</h2>
                                <p>{achievement.achievementTitle}</p>
                            </div>
                        </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
);
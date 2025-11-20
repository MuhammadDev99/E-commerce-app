import styles from "./style.module.css";
import { SHOP_NAME } from "../../constants";
import { Link } from "react-router-dom";
import { workshop, teamMember1, teamMember2, teamMember3 } from "../../assets/images";
function About() {
    document.title = "About";
    return (
        <div className={styles.aboutPage}>
            {/* --- Hero Section --- */}
            <header className={styles.hero}>
                {/* Text content comes first now */}
                <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>Crafting 'Spark' Into Everyday Life</h1>
                    <p className={styles.heroSubtitle}>
                        {SHOP_NAME} is more than a store. It's a curated collection of unique items designed to bring joy and inspiration into your home.
                    </p>
                </div>
                {/* This div is now just for the image */}
                <div className={styles.heroOverlay}></div>
            </header>

            {/* --- Our Story Section --- */}
            <section className={`${styles.contentSection} ${styles.storySection}`}>
                <div className={styles.storyImage}>
                    <img src={workshop} />
                </div>
                <div className={styles.storyText}>
                    <h2>The Journey of {SHOP_NAME}</h2>
                    <p>
                        Our story began in a small workshop with a simple mission: to create beautiful, functional objects that last. We saw a world of mass-produced goods and yearned for items with soul and a story.
                    </p>
                    <p>
                        Today, {SHOP_NAME} has grown, but our core principles remain. We partner with artisans and designers who share our passion for quality, sustainability, and thoughtful design. Every product in our shop is handpicked, ensuring it represents the values we stand for.
                    </p>
                </div>
            </section>

            {/* --- Our Values Section --- */}
            <section className={`${styles.contentSection} ${styles.valuesSection}`}>
                <h2 className={styles.sectionTitle}>Our Core Values</h2>
                <div className={styles.valuesGrid}>
                    <div className={styles.valueCard}>
                        <div className={styles.valueIcon}>🎨</div>
                        <h3>Unmatched Quality</h3>
                        <p>We believe in products that are built to last, using the finest materials and exceptional craftsmanship.</p>
                    </div>
                    <div className={styles.valueCard}>
                        <div className={styles.valueIcon}>✨</div>
                        <h3>Creative Design</h3>
                        <p>We celebrate unique, innovative designs that are both beautiful and functional, adding a spark to your space.</p>
                    </div>
                    <div className={styles.valueCard}>
                        <div className={styles.valueIcon}>❤️</div>
                        <h3>Customer Joy</h3>
                        <p>Your happiness is our priority. We strive to provide an outstanding experience from browsing to unboxing.</p>
                    </div>
                </div>
            </section>

            {/* --- Team Section --- */}
            <section className={`${styles.contentSection} ${styles.teamSection}`}>
                <h2 className={styles.sectionTitle}>Meet the Makers</h2>
                <div className={styles.teamGrid}>
                    <div className={styles.teamMember}>
                        <img src={teamMember1} alt="Founder Jane Doe" />
                        <h3>Jane Doe</h3>
                        <p>Founder & Chief Curator</p>
                    </div>
                    <div className={styles.teamMember}>
                        <img src={teamMember2} />
                        <h3>John Smith</h3>
                        <p>Head of Design</p>
                    </div>
                    <div className={styles.teamMember}>
                        <img src={teamMember3} alt="Customer Happiness Lead Emily Jones" />
                        <h3>Emily Jones</h3>
                        <p>Customer Happiness</p>
                    </div>
                </div>
            </section>

            {/* --- Call to Action Section --- */}
            <section className={styles.ctaSection}>
                <h2>Ready to Find Your Spark?</h2>
                <p>Browse our curated collection and discover items you'll love for years to come.</p>
                <Link to="/products" className={styles.ctaButton}>Explore Products</Link>
            </section>
        </div>
    );
}

export default About;
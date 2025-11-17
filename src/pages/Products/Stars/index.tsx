import styles from "./style.module.css"
import fullStar from "./images/full-star.png"
import emptyStar from "./images/empty-star.png"
import halfStar from "./images/half-star.png"

function Stars({ stars }: { stars: number }) {
    // Create an array to hold the star elements
    const starElements = [];

    // Loop 5 times to represent the 5 stars
    for (let i = 1; i <= 5; i++) {
        if (stars >= i) {
            // If the rating is greater than or equal to the current star's position, it's a full star.
            starElements.push(<img key={`full-${i}`} src={fullStar} alt="Full Star" />);
        } else if (stars >= i - 0.5) {
            // If the rating is not a full star, check if it's at least a half star.
            starElements.push(<img key={`half-${i}`} src={halfStar} alt="Half Star" />);
        } else {
            // Otherwise, it's an empty star.
            starElements.push(<img key={`empty-${i}`} src={emptyStar} alt="Empty Star" />);
        }
    }

    return (
        <div className={styles.stars}>
            <p className={styles.starsCount}>{stars}</p>
            {starElements}
        </div>
    )
}

export default Stars
import styles from "./images.module.scss";

export function renderImageLayout(mainImage: string, secondaryImages: string[], additionalImages: string[]) {
    // Render the secondary images layout
    console.log(additionalImages.length);

    const renderSecondaryImages = (secondaryImages: string[]) => {
        return (
            // If there are no additional images, show all secondary images
            secondaryImages.length === 0 &&
                additionalImages.length === 0 ?
                (secondaryImages.map((image, index) => (
                    <img key={index} src={image} alt={`Secondary Image ${index + 1}`} />
                ))) : (
                    // If there are additional images, show the first two secondary images and a "see more" button
                    <>
                        <img src={secondaryImages[0]} alt="Secondary Image" />

                        {additionalImages.length != 0 ?

                            <div className={styles.expand_additional_images}>
                                <img src={secondaryImages[1]} alt="Secondary Image" />
                            </div>
                            : <></>}
                    </>
                )
        )
    }

    if (secondaryImages.length === 0 && additionalImages.length === 0) {
        return (
            <div className={`${styles.images_layout} ${styles.single_image}`}>
                <div className={styles.main_image}>
                    <img src={mainImage} alt="Main Property" />
                </div>
            </div>
        )
    }

    return (
        <>
            <div className={styles.images_layout}>
                <div className={styles.main_image}>
                    <img src={mainImage} alt="Main Property" />
                </div>

                <div className={styles.secondary_images}>
                    {renderSecondaryImages(secondaryImages)}
                </div>
            </div>
        </>
    )
}

export function distributeImages(images: string[]) {
    const mainImage: string = images[0]
    const secondaryImages: string[] = images.slice(1, 3) ?? []
    const additionalImages: string[] = images.slice(3) ?? []
    console.log(images);
    return { mainImage, secondaryImages, additionalImages }
}
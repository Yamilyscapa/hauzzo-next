import { Property as PropertyType } from '@/types'
import Navbar from '@/components/ui/Navbar/Navbar'
import { getPropertyById } from '@/logic/properties/properties.controller'
import styles from './page.module.scss'
import { formatPrice } from '@/utils/text'
import { distributeImages, renderImageLayout } from './images.handler'

export default async function PropertyPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const property: PropertyType | null = await getPropertyById(id, {
        cache: 'force-cache',
        next: {
            revalidate: 60 * 60, // Revalidate every hour
            tags: ['property', `property-${id}`], // Tags for cache invalidation
        },
    })

    if (!property) {
        return (
            <div className={styles.error}>
                <h1>Property not found</h1>
                <p>The property you are looking for does not exist.</p>
            </div>
        )
    }

    // Ensure tags are an array and handle empty tags
    if (property.tags?.length === 0 || !Array.isArray(property.tags)) {
        property.tags = ['No tags available']
    }

    // Ensure images are an array and handle empty images
    if (!Array.isArray(property.images) || property.images.length === 0) {
        property.images = ['/images/default-property.jpg'] // Fallback image
    }

    const { mainImage, secondaryImages, additionalImages } = distributeImages(property.images)

    return (
        <>
            <Navbar />

            <section className={`section ${styles.property}`}>

                <div className={styles.property_images}>
                    {renderImageLayout(mainImage, secondaryImages, additionalImages)}
                </div>

                <div className={styles.property_header}>
                    <h1>{property.title}</h1>
                    <h3>{formatPrice(property.price)}</h3>

                    <div className={styles.property_details}>
                        <div className={styles.property_tags}>
                            {property.tags.map((tag, index) => (
                                <span key={index} className={styles.tag}>
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <p className={styles.property_description}>{property.description}</p>
                    </div>
                </div>
            </section>
        </>
    )
}
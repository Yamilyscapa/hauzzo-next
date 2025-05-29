import { Property as PropertyType } from '@/types'
// import styles from './page.module.css'

interface ApiResponse {
    data: PropertyType
}

export default async function PropertyPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    let property: PropertyType | null = null

    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_HOST}/properties/${id}`,
            {
                cache: 'force-cache',
                next: {
                    revalidate: 600,
                    tags: ['property', `property-${id}`]
                }, // Revalidate every 10 minutes
            }
        )

        if (!res.ok) throw new Error('Failed to fetch property')

        const json: ApiResponse = await res.json()
        property = json.data
    } catch (err) {
        console.error('Error fetching property:', err)
    }

    return (
        <div className="section">
            <h1>Property Page {property?.id ?? 'Not found'}</h1>
            {property ? (
                <pre>{JSON.stringify(property, null, 2)}</pre>
            ) : (
                <p>Property not found</p>
            )}
        </div>
    )
}
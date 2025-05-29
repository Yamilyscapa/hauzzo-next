import { Property as PropertyType } from '@/types'
// import styles from './page.module.css'

interface ApiResponse {
    data: PropertyType
}

interface Props {
    params: { id: string }
}

export default async function PropertyPage({ params }: Props) {
    let property: PropertyType | null = null

    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_HOST}/properties/${params.id}`,
            {
                cache: 'force-cache',
                next: { revalidate: 60 * 60 } // 1 hour
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
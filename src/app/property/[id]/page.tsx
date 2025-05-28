import { Property as PropertyType } from '@/types'

interface ApiResponse {
    data: PropertyType
}

export default async function PropertyPage({ params }: { params: { id: string } }) {
    const fetchProperty = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/properties/${params.id}`)
            const { data }: ApiResponse = await response.json()
            console.log(data)
            return data
        } catch (err) {
            console.error(err)
            return null
        }
    }

    const property = await fetchProperty()

    return (
        <div>
            <h1>Property Page {params.id}</h1>
            {property ? (
                <pre>{JSON.stringify(property, null, 2)}</pre>
            ) : (
                <p>Property not found</p>
            )}
        </div>
    )
}
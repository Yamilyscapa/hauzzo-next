import { Property as PropertyType } from "@/types";

/** 
*  @params limit: number - The maximum number of properties to fetch, default is 10 
* */

export async function getManyProperties(limit: number = 10): Promise<PropertyType[]> {
    const API_URL = process.env.NEXT_PUBLIC_API_HOST ?? ''

    if (API_URL === '') {
        throw new Error('API URL is not defined');
    }

    try {
        const response = await fetch(`${API_URL}/properties/all?limit=${limit}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },

        });

        if (!response.ok) {
            throw new Error(`Error fetching properties: ${response.statusText}`);
        }

        const res = await response.json()

        if (!res.data || !Array.isArray(res.data)) {
            throw new Error('Invalid response format: expected an array of properties');
        }

        if (res.data.length === 0) {
            console.warn('No properties found');
        }
        
        return res.data as PropertyType[];
    } catch (error) {
        throw new Error(`Error fetching properties: ${error}`);
    }
}

export async function getProperty(id: string) {
    const API_URL = process.env.NEXT_PUBLIC_API_HOST ?? ''

    if (API_URL === '') {
        throw new Error('API URL is not defined');
    }

    if (!id) {
        throw new Error('Property ID is required');
    }

    const response = await fetch(`${API_URL}/proeprties/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error(`Error fetching property with id ${id}: ${response.statusText}`);
    }

    console.log(response.json());

    return response.json();

}
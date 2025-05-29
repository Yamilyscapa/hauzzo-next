import { Property as PropertyType } from "@/types";

/** 
*  @params limit: number - The maximum number of properties to fetch, default is 10 
* */

interface CacheConfig {
    cache?: 'default' | 'no-store' | 'reload' | 'force-cache' | 'only-if-cached';
    next?: {
        revalidate?: number; // Time in seconds to revalidate the cache
        tags?: string[]; // Tags for cache invalidation
    };
}
/**
 * 
 * @param limit - The maximum number of properties to fetch, default is 10
 * @param cache - Optional cache configuration for the fetch request
 * @param cache.cache - Cache mode, can be 'default', 'no-store', 'reload', 'force-cache', or 'only-if-cached'
 * @param cache.next - Next.js specific cache configuration
 * @param cache.next.revalidate - Time in seconds to revalidate the cache
 * @param cache.next.tags - Tags for cache invalidation
 * @returns 
 */

export async function getManyProperties(limit: number = 10, cache?: CacheConfig): Promise<PropertyType[]> {
    const API_URL = process.env.NEXT_PUBLIC_API_HOST ?? ''
    let cacheConfig = {}

    if (cache) {
        cacheConfig = { ...cache }
    }


    if (API_URL === '') {
        throw new Error('API URL is not defined');
    }

    try {
        const response = await fetch(`${API_URL}/properties/all?limit=${limit}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            ...cacheConfig
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
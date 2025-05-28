// ENUM para el tipo de transacción
enum TransactionType {
    Sale = 'sale',
    Rent = 'rent',
}

// ENUM para el tipo de propiedad
enum PropertyType {
    House = 'house',
    Apartment = 'apartment',
}


export interface Property {
    id: string; // UUID
    title: string;
    description?: string;
    price: number;
    tags?: string[];
    bedrooms?: number;
    bathrooms?: number;
    parking?: number;
    transaction: TransactionType;
    location: Record<string, any>; // JSONB
    type: PropertyType;
    images?: string[];
    active?: boolean;
    broker_id: string; // UUID
}
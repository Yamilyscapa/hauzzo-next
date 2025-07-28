export type TransactionType = "rent" | "sale";
export type PropertyType = "house" | "apartment";

export interface PropertyLocationType {
  zip: string;
  city: string;
  state: string;
  street: string;
  address: string;
  neighborhood: string;
  addressNumber: string;
}

export interface PropertyContent {
  id: string;
  title: string;
  description: string;
  price: number;
  tags: string[];
  bedrooms: number;
  bathrooms: number;
  parking: number;
  location: PropertyLocationType;
  type: PropertyType;
  transaction: TransactionType;
  images: string[];
}

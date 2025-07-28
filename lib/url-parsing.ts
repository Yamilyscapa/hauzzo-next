import { PropertyContent } from "@/types/property";

export const urlWithQuery = (query: PropertyContent) => {
    const {
        title,
        price,
        type,
        bathrooms,
        parking,
        transaction,
        location,
    } = query;
    const { city, neighborhood, zip } = location || {};
    return `/properties/${query.id}?title=${encodeURIComponent(title)}&price=${price}&type=${type}&bathrooms=${bathrooms}&parking=${parking}&transaction=${transaction}&city=${encodeURIComponent(
        city || ""
    )}&neighborhood=${encodeURIComponent(neighborhood || "")}&zip=${encodeURIComponent(zip || "")}`;
};
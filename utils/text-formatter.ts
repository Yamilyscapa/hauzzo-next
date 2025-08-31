export function formatPrice(price: number): string {
  return price.toLocaleString("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
  });
}

export function formatDescription(
  text: string,
  maxCharacters: number = 10,
): string {
  if (!text || typeof text !== "string") {
    return "";
  }

  const trimmed = text.trim();
  if (!trimmed) {
    return "";
  }

  return trimmed.slice(0, maxCharacters) + "...";
}

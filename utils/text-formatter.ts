export function formatPrice(price: number): string {
  return price.toLocaleString("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
  });
}

export function formatDescription(
  description: string,
  maxWords: number = 10,
): string {
  if (!description || typeof description !== "string") {
    return "";
  }

  const trimmed = description.trim();
  if (!trimmed) {
    return "";
  }

  const words = trimmed.split(/\s+/);

  if (words.length <= maxWords) {
    return trimmed;
  }

  return words.slice(0, maxWords).join(" ") + "...";
}

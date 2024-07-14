export const formatPrice = (price: number, currencyCode: string) => {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
    style: "currency",
    currency: currencyCode,
  }).format(price);
};

"use client";

import { useCurrency } from "@/context/CurrencyContext";

interface ProductPriceProps {
  priceUsd: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function ProductPrice({ priceUsd, className, style }: ProductPriceProps) {
  const { formatPrice } = useCurrency();
  return (
    <span className={className} style={style}>
      {formatPrice(priceUsd)}
    </span>
  );
}

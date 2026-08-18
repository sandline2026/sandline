"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function SortSelect({ collection }: { collection: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(searchParams.toString());
    if (e.target.value) {
      params.set("sort", e.target.value);
    } else {
      params.delete("sort");
    }
    router.push(`/collections/${collection}?${params.toString()}`);
  }

  return (
    <select className="sort-select" onChange={handleChange} defaultValue={searchParams.get("sort") || ""}>
      <option value="">Sort: Newest</option>
      <option value="price_asc">Price: Low to High</option>
      <option value="price_desc">Price: High to Low</option>
    </select>
  );
}

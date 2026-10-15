"use client";

import ProductListClient from "./ProductListClient";

export default function ProdcutsPage() {
  return (
    <ProductListClient
      initialProducts={[]}
      initialTotal={0}
    />
  );
}

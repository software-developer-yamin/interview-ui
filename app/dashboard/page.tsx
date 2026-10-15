"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

type Product = {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
};

type ProductsResponse = {
  products: Product[];
  total: number;
};

export default function List() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const loaderRef = useRef<HTMLDivElement | null>(null);
  const skipRef = useRef(0);
  const loadingRef = useRef(false);

  const LIMIT = 10;

  const handleLogout = () => {
    // Replace this with your actual token-clearing utility.
    localStorage.removeItem("authToken");

    router.replace("/");
  };

  useEffect(() => {
    const fetchProducts = async () => {
      if (loadingRef.current || !hasMore) return;

      loadingRef.current = true;
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://dummyjson.com/products?limit=${LIMIT}&skip=${skipRef.current}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data: ProductsResponse = await response.json();

        setProducts((prev) => [...prev, ...data.products]);
        skipRef.current += data.products.length;
        setHasMore(skipRef.current < data.total);
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "Something went wrong"
        );
      } finally {
        loadingRef.current = false;
        setLoading(false);
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void fetchProducts();
        }
      },
      {
        root: null,
        rootMargin: "200px",
        threshold: 0,
      }
    );

    const loader = loaderRef.current;

    if (loader) observer.observe(loader);

    return () => observer.disconnect();
  }, [hasMore]);

  return (
    <section className="mx-auto max-w-6xl p-6">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Products</h1>

        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-lg border border-red-500/40 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
        >
          <LogOut size={16} />
          Logout
        </button>
      </header>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <article
            key={product.id}
            className="overflow-hidden rounded-lg border p-4"
          >
            <img
              src={product.thumbnail}
              alt={product.title}
              className="h-48 w-full rounded-md object-cover"
              loading="lazy"
            />

            <h2 className="mt-3 text-lg font-semibold">
              {product.title}
            </h2>

            <p className="mt-1 line-clamp-2 text-sm text-gray-500">
              {product.description}
            </p>

            <p className="mt-3 font-bold">${product.price}</p>
          </article>
        ))}
      </div>

      {error && (
        <div className="mt-6 text-center">
          <p className="text-red-500">{error}</p>

          <button
            type="button"
            onClick={() => {
              setError(null);
              setHasMore(true);
            }}
            className="mt-2 rounded border px-4 py-2"
          >
            Retry
          </button>
        </div>
      )}

      <div
        ref={loaderRef}
        className="py-8 text-center"
        aria-live="polite"
      >
        {loading && <p>Loading products...</p>}

        {!hasMore && (
          <p>You've reached the end of the products.</p>
        )}
      </div>
    </section>
  );
}

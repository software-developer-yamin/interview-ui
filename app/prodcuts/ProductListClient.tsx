"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LogOut,
  Search,
  ShieldCheck,
  Star,
  Loader2,
  RefreshCw,
  ShoppingBag,
  Filter,
} from "lucide-react";
import {
  apiGetMe,
  getAuthToken,
  removeAuthToken,
  type AuthUser,
} from "../auth";

export type Product = {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  category?: string;
  rating?: number;
  stock?: number;
  brand?: string;
};

type ProductsResponse = {
  products: Product[];
  total: number;
};

interface ProductListClientProps {
  initialProducts: Product[];
  initialTotal: number;
}

export default function ProductListClient({
  initialProducts,
  initialTotal,
}: ProductListClientProps) {
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [totalCount, setTotalCount] = useState(initialTotal);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const loaderRef = useRef<HTMLDivElement | null>(null);
  const skipRef = useRef(initialProducts.length);
  const loadingRef = useRef(false);

  const LIMIT = 12;

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      apiGetMe(token)
        .then((user) => setCurrentUser(user))
        .catch(() => {
          removeAuthToken();
          setCurrentUser(null);
        });
    }
  }, []);

  const handleLogout = () => {
    removeAuthToken();
    localStorage.removeItem("authToken");
    router.replace("/");
  };

  const fetchMoreProducts = useCallback(async () => {
    if (loadingRef.current || !hasMore) return;

    loadingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://dummyjson.com/products?limit=${LIMIT}&skip=${skipRef.current}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch products from catalog");
      }

      const data: ProductsResponse = await response.json();

      setProducts((prev) => [...prev, ...data.products]);
      setTotalCount(data.total);
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
  }, [hasMore]);

  useEffect(() => {
    void fetchMoreProducts();
  }, [fetchMoreProducts]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void fetchMoreProducts();
        }
      },
      {
        root: null,
        rootMargin: "300px",
        threshold: 0,
      }
    );

    const loader = loaderRef.current;
    if (loader) observer.observe(loader);

    return () => observer.disconnect();
  }, [fetchMoreProducts]);

  const handleRetry = () => {
    setError(null);
    setHasMore(true);
    void fetchMoreProducts();
  };

  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ["all", ...Array.from(set)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let list = products;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== "all") {
      list = list.filter((p) => p.category?.toLowerCase() === selectedCategory);
    }

    return list;
  }, [products, searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-[#020817] text-white antialiased selection:bg-[#168bff] selection:text-white flex flex-col">
      <header className="sticky top-0 z-30 border-b border-[#183a66]/70 bg-[#020817]/85 backdrop-blur-md">
        <div className="mx-auto flex h-[74px] max-w-7xl items-center justify-between px-4 sm:px-8">
          <Link href="/" className="flex items-center gap-3">
            <img
              src="/assets/logo/datapulse-wordmark-login-reference.png"
              alt="DataPulse"
              className="h-[36px] w-auto transition hover:brightness-110"
            />
          </Link>

          <nav className="hidden items-center gap-3 whitespace-nowrap text-[12px] text-[#c4d9f4] md:flex">
            <span>Secure Data</span>
            <span className="text-blue-400">·</span>
            <span>Smart Insights</span>
            <span className="text-blue-400">·</span>
            <span>Better Decisions</span>
          </nav>

          <div className="flex items-center gap-3 sm:gap-4">
            {currentUser && (
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-semibold text-white">
                  {currentUser.name || "Active User"}
                </span>
                <span className="text-[11px] text-[#8ba9cf] truncate max-w-[150px]">
                  {currentUser.email}
                </span>
              </div>
            )}

            <button
              type="button"
              onClick={handleLogout}
              className="flex h-[41px] items-center gap-2 rounded-[12px] border border-red-500/50 bg-red-950/20 px-3.5 text-xs font-semibold text-red-400 transition hover:bg-red-500/15 hover:text-red-300 cursor-pointer"
            >
              <LogOut size={15} />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-8 sm:py-12">
        <section className="relative isolate overflow-hidden rounded-[24px] border border-[#16315a] bg-gradient-to-r from-[#07162b] via-[#051122] to-[#0a1832] p-6 sm:p-10 shadow-[0_15px_60px_rgba(0,0,0,0.35)]">
          <div
            className="absolute inset-0 -z-20 bg-cover bg-center bg-no-repeat opacity-15"
            style={{
              backgroundImage: "url('/assets/images/hero-analytics-mountain.png')",
            }}
          />
          <div className="pointer-events-none absolute -right-10 -top-10 h-64 w-64 rounded-full bg-[#168bff]/10 blur-[80px]" />
          <div className="pointer-events-none absolute -left-10 -bottom-10 h-64 w-64 rounded-full bg-[#7b35ff]/10 blur-[90px]" />

          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/40 bg-[#07162b]/80 px-3 py-1.5 text-xs text-[#c4dcff] max-w-full">
              <ShieldCheck size={15} className="fill-blue-500 text-blue-200 shrink-0" />
              <span className="truncate">Real-Time Catalog Feed</span>
              <span className="text-blue-400">·</span>
              <span className="font-mono text-[#00d7a0] shrink-0">
                {totalCount > 0 ? `${totalCount} Products` : "Live Stock"}
              </span>
            </div>

            <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl">
              Explore Our{" "}
              <span className="bg-gradient-to-r from-[#299fff] via-[#4387ff] to-[#a23aff] bg-clip-text text-transparent">
                Product Catalog
              </span>
            </h1>

            <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#c4dcf6]">
              Discover premium products synced in real-time from our data collection platform. Filter by category, search specifications, and track live prices.
            </p>
          </div>
        </section>

        <section className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-[20px] border border-[#16315a] bg-[#061329]/90 p-4 shadow-lg backdrop-blur-sm">
          <div className="relative flex-1 sm:max-w-md">
            <Search
              size={17}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8ba9cf]"
            />
            <input
              type="text"
              placeholder="Search products by title, brand, or details..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-[45px] w-full rounded-[12px] border border-[#294b78] bg-[#0b192d]/80 pl-10 pr-4 text-xs sm:text-sm text-white outline-none transition placeholder:text-[#91acd0] focus:border-[#428bff] focus:bg-[#0b192d]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-[#8ba9cf]">
              <Filter size={14} />
              Category:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {categories.slice(0, 6).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-semibold capitalize transition cursor-pointer ${
                    selectedCategory === cat
                      ? "border border-[#00c8ff]/70 bg-gradient-to-r from-[#168bff] to-[#00c8ff] text-white shadow-[0_0_15px_rgba(0,200,255,0.25)]"
                      : "border border-[#183a66] bg-[#07162b]/80 text-[#a9c4e8] hover:border-blue-400/50 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between text-xs text-[#8ba9cf]">
            <span>
              Showing <span className="font-bold text-white">{filteredProducts.length}</span> of{" "}
              <span className="font-bold text-white">{totalCount || products.length}</span> products
            </span>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-[#00c8ff] hover:underline"
              >
                Clear search filter
              </button>
            )}
          </div>

          {filteredProducts.length === 0 && !loading && (
            <div className="rounded-[20px] border border-[#16315a] bg-[#061329] p-12 text-center">
              <ShoppingBag size={40} className="mx-auto text-[#8ba9cf]" />
              <h3 className="mt-4 text-lg font-bold text-white">No products found</h3>
              <p className="mt-1 text-xs text-[#a9c4e8]">
                Try adjusting your search query or switching to another category.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="mt-4 rounded-xl border border-blue-500/50 bg-blue-500/10 px-4 py-2 text-xs font-semibold text-[#55aaff] hover:bg-blue-500/20"
              >
                Reset Filters
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <article
                key={product.id}
                className="group relative flex flex-col overflow-hidden rounded-[20px] border border-[#16315a] bg-gradient-to-br from-[#09152a] via-[#030b18] to-[#07091b] p-5 shadow-[0_15px_50px_rgba(0,0,0,0.25)] transition hover:border-blue-400/60 hover:shadow-[0_15px_60px_rgba(22,139,255,0.15)]"
              >
                <div className="relative h-52 w-full overflow-hidden rounded-[14px] bg-[#030914] border border-[#183a66]/60">
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#020817] via-transparent to-transparent opacity-50" />

                  <div className="absolute left-3 top-3">
                    <span className="rounded-lg border border-[#183a66] bg-[#020817]/85 px-2.5 py-1 text-[11px] font-semibold text-[#00c8ff] backdrop-blur-sm capitalize">
                      {product.category || "General"}
                    </span>
                  </div>

                  <div className="absolute right-3 top-3 flex items-center gap-1 rounded-lg border border-amber-500/30 bg-[#020817]/85 px-2.5 py-1 text-[11px] font-bold text-amber-300 backdrop-blur-sm">
                    <Star size={12} className="fill-amber-400 text-amber-400" />
                    <span>{product.rating ?? 4.8}</span>
                  </div>
                </div>

                <div className="mt-4 flex flex-1 flex-col justify-between">
                  <div>
                    <h2 className="text-base font-bold text-white group-hover:text-[#00c8ff] transition line-clamp-1">
                      {product.title}
                    </h2>

                    <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-[#c4dcf6]">
                      {product.description}
                    </p>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-[#183a66]/60 pt-4">
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-[#8ba9cf]">
                        Price
                      </span>
                      <p className="text-xl font-extrabold text-white">
                        ${product.price.toFixed(2)}
                      </p>
                    </div>

                    <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/30 px-3 py-1 text-xs font-semibold text-[#00d7a0]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#00d7a0] shadow-[0_0_6px_#00d7a0]" />
                      <span>In Stock</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {error && (
            <div className="mt-8 rounded-[18px] border border-red-500/40 bg-red-950/40 p-6 text-center">
              <p className="text-sm font-semibold text-red-200">{error}</p>
              <button
                type="button"
                onClick={handleRetry}
                className="mt-3 inline-flex items-center gap-2 rounded-xl border border-red-500/50 bg-red-500/20 px-4 py-2 text-xs font-bold text-white transition hover:bg-red-500/30 cursor-pointer"
              >
                <RefreshCw size={14} />
                <span>Retry Loading</span>
              </button>
            </div>
          )}

          <div
            ref={loaderRef}
            className="mt-10 py-6 text-center"
            aria-live="polite"
          >
            {loading && (
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/40 bg-[#07162b] px-5 py-2 text-xs font-semibold text-[#00c8ff] shadow-md">
                <Loader2 size={16} className="animate-spin text-[#00c8ff]" />
                <span>Loading more products...</span>
              </div>
            )}

            {!hasMore && !loading && products.length > 0 && (
              <p className="text-xs text-[#8ba9cf]">
                You have reached the end of the catalog ({products.length} products loaded).
              </p>
            )}
          </div>
        </section>
      </main>

      <footer className="mt-auto border-t border-[#183a66]/60 bg-[#020817] py-6 text-center text-xs text-[#8ba9cf]">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 DataPulse Technologies Inc. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[12px]">
            <Link href="/" className="hover:text-white transition">
              Home
            </Link>
            <span className="text-[#183a66]">·</span>
            <span className="text-[#00d7a0]">System Online</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

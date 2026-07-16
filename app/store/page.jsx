import { api } from "@/lib/api";
import { ProductCard } from "@/components/store/product-card";

export const revalidate = 60;

async function getStoreData() {
  try {
    const [products, categories, sliders, tickers] = await Promise.all([
      api.get("/store/products?limit=8&sort=newest").catch(() => []),
      api.get("/store/categories").catch(() => []),
      api.get("/store/sliders?active=true").catch(() => []),
      api.get("/store/tickers?active=true").catch(() => []),
    ]);
    return { products, categories, sliders, tickers };
  } catch {
    return { products: [], categories: [], sliders: [], tickers: [] };
  }
}

export default async function StoreHomePage() {
  const { products, categories, sliders, tickers } = await getStoreData();

  return (
    <div className="bg-[#fafafa] min-h-screen pb-12">
      {/* 1. Carousel Section */}
      <section className="container mx-auto px-4 py-6">
        {sliders.length > 0 ? (
          <div className="relative rounded-2xl overflow-hidden bg-muted">
            {sliders.map((slider, i) => (
              <div key={slider.id || i} className="text-center py-16 md:py-24">
                {slider.title && <h1 className="text-3xl md:text-5xl font-bold mb-4">{slider.title}</h1>}
                {slider.subtitle && <p className="text-lg text-muted-foreground mb-6">{slider.subtitle}</p>}
                {slider.linkText && slider.linkUrl && (
                  <a href={slider.linkUrl} className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#E92B58] text-white font-bold hover:bg-[#d0204b] transition-all">
                    {slider.linkText}
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="relative rounded-3xl overflow-hidden bg-black aspect-[4/3] sm:aspect-[21/9] md:aspect-[3/1] flex items-center shadow-xl">
             <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-transparent w-full md:w-2/3 z-10 mix-blend-multiply"></div>
             {/* Text Content */}
             <div className="relative z-20 p-8 md:p-16 w-full md:w-1/2 flex flex-col items-center md:items-start justify-center h-full text-center md:text-left">
               <h1 className="text-white text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] drop-shadow-2xl italic">
                 <span className="block text-4xl md:text-6xl text-white font-serif italic font-normal tracking-normal mb-[-10px] md:mb-[-20px]">Sale</span>
                 BLACK<br/>FRIDAY
               </h1>
               <div className="mt-6 md:mt-10">
                 <a href="/store/products" className="bg-[#E92B58] text-white px-8 md:px-10 py-3 md:py-4 rounded-full font-bold text-base md:text-lg hover:bg-[#d0204b] transition-transform hover:scale-105 shadow-xl inline-block">
                   Shop Now
                 </a>
               </div>
             </div>
             <div className="absolute right-0 top-0 bottom-0 w-full md:w-2/3 bg-[url('https://images.unsplash.com/photo-1607083206869-4c7672072395?q=80&w=2087&auto=format&fit=crop')] bg-cover bg-center md:bg-right opacity-60"></div>
          </div>
        )}
      </section>

      {tickers.length > 0 && (
        <div className="bg-[#1A1F2C] text-white overflow-hidden my-2">
          <div className="flex animate-marquee whitespace-nowrap py-2.5">
            {[...tickers, ...tickers].map((ticker, i) => (
              <span key={i} className="mx-8 text-sm font-semibold tracking-wide uppercase">
                {ticker.text}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 2. Horizontal Categories Section */}
      <section className="container mx-auto px-4 py-6">
        <div className="flex overflow-x-auto pb-4 gap-3 scrollbar-hide no-scrollbar items-center">
          <a href="/store/products" className="shrink-0 flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#E92B58] text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all border border-[#E92B58]">
            <span className="material-symbols-outlined text-lg">widgets</span>
            All Products
          </a>
          {categories.length > 0 ? categories.map((cat) => (
            <a
              key={cat.id}
              href={`/store/products?category=${cat.slug || cat.id}`}
              className="shrink-0 flex items-center gap-2 px-6 py-2.5 rounded-full border border-gray-200 bg-white text-gray-700 font-medium text-sm hover:border-gray-300 hover:bg-gray-50 transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-lg text-gray-500">inventory_2</span>
              {cat.name}
            </a>
          )) : (
            // Fallbacks to match screenshot if API fails
            ["Chain", "Cosmetics", "Jewellery", "Lipsticks", "Mens", "Rings", "Shirt"].map((cat) => (
               <a
                key={cat}
                href={`/store/products?category=${cat.toLowerCase()}`}
                className="shrink-0 flex items-center gap-2 px-6 py-2.5 rounded-full border border-gray-200 bg-white text-gray-700 font-medium text-sm hover:border-gray-300 hover:bg-gray-50 transition-colors shadow-sm"
              >
                <span className="material-symbols-outlined text-lg text-gray-400">diamond</span>
                {cat}
              </a>
            ))
          )}
        </div>
      </section>

      {/* 3. Featured Products Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 border-t border-gray-200 pt-8">
          <div>
            <h2 className="text-3xl font-bold font-serif text-gray-900 tracking-tight">Featured Collection</h2>
            <p className="text-gray-500 mt-2 text-sm">Discover our curated selection of premium items</p>
          </div>
          <a href="/store/products" className="text-sm font-bold text-[#E92B58] hover:underline flex items-center gap-1 group">
            View All Products
            <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">arrow_forward</span>
          </a>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        {products.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
            <span className="material-symbols-outlined text-5xl mb-4 block text-gray-300">inventory_2</span>
            <p className="text-gray-500 font-medium">No products available yet.</p>
          </div>
        )}
      </section>
    </div>
  );
}

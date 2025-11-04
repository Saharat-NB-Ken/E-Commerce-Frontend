import { useState } from "react";
export default function SampleEcommerceUI2() {
  const [cart, setCart] = useState<{ [id: string]: { id: string, name: string, price: number, qty: number } }>({});
  
  const addToCart = (id: string, name: string, price: number) => {
    setCart(prev => {
      const item = prev[id] || { id, name, price, qty: 0 };
      item.qty += 1;
      return { ...prev, [id]: item };
    });
  };
  const totalQty = Object.values(cart).reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = Object.values(cart).reduce((sum, item) => sum + item.qty * item.price, 0);

  return (
    <div className="bg-gray-50 text-gray-800 antialiased">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            <div className="flex items-center gap-4">
              <div className="hidden sm:block">
                <label className="relative block">
                  <input
                    id="search"
                    className="w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    placeholder="ค้นหาสินค้า..."
                  />
                </label>
              </div>

              <button className="relative p-2 rounded-md hover:bg-gray-100">
                🛒<span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full px-1.5">{totalQty}</span>
              </button>

              <a href="#" className="hidden md:inline-block px-4 py-2 rounded-md border border-indigo-600 text-indigo-600 text-sm">Sign in</a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-r from-indigo-50 to-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <p className="mt-3 text-gray-600 max-w-xl">เลือกซื้อสินค้าหลากหลายประเภท ราคาดี พร้อมโปรโมชั่นประจำสัปดาห์</p>
          </div>
          <div className="w-full md:w-1/2">
            <img
              src="https://images.unsplash.com/photo-1606813903108-3b8f1a9e6c2a?q=80&w=900&auto=format&fit=crop&ixlib=rb-4.0.3&s=1c9a2f3f5ce7a7b7b9e4a9d9d3a3b4b2"
              alt="hero"
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Products grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Example product */}
          {[
            { id: "1", name: "Leather Sneakers", price: 1490, img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=1a2b3c4d5e6f7g8h9i0j" },
            { id: "2", name: "Classic Watch", price: 3200, img: "https://images.unsplash.com/photo-1526178611532-22e1f5a6f6f3?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=abcdef123456" }
          ].map(product => (
            <article key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden group">
              <div className="relative">
                <img className="w-full h-44 object-cover" src={product.img} alt={product.name} />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900">{product.name}</h3>
                <div className="mt-3 flex items-center justify-between">
                  <div className="font-bold text-indigo-600">฿{product.price}</div>
                  <button
                    className="px-3 py-1 bg-indigo-600 text-white text-sm rounded"
                    onClick={() => addToCart(product.id, product.name, product.price)}
                  >
                    Add
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>

        {/* Cart total */}
        <div className="mt-6 text-right font-bold text-indigo-600">
          รวม: ฿{totalPrice}
        </div>
      </main>
    </div>
  );
}

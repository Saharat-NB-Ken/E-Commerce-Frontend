export const HeroSection = () => (
    <section className="mx-auto max-w-6xl mt-5 mb-10">
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-16 flex items-center justify-between">
            <div>
                <h1 className="text-5xl font-bold text-green-800 mb-8 leading-tight">
                    Grab Upto 50% Off On<br />
                    Selected Products
                </h1>
                <button className="bg-green-800 hover:bg-green-900 text-white px-8 py-4 rounded-full font-semibold transition-colors">
                    Buy Now
                </button>
            </div>
            <div className="relative">
                <div className="w-96 h-72 relative">
                    <div className="absolute top-10 right-10 w-40 h-40 bg-purple-300 rounded-full opacity-70"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl opacity-50 flex items-center justify-center">
                        <div className="text-6xl">🎧</div>
                    </div>
                </div>
            </div>
        </div>
    </section>
);
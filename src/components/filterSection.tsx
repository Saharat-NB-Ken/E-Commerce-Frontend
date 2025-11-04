import type { Category } from "../types/product.types";

export interface FilterProps {
    showCategory?: boolean;
    showSearch?: boolean;
    showPriceFilter?: boolean;
    showSorting?: boolean;

    orderBy?: string;
    orderDirection?: "asc" | "desc";
    categories?: Category[];
    selectedCategory?: string | number;
    onCategoryChange?: (value: string) => void;
    onOrderByChange?: (value: string) => void;
    onOrderDirectionChange?: (value: "asc" | "desc") => void;
    priceRange?: { min: number | ""; max: number | "" };
    onPriceRangeChange?: (range: { min: number | ""; max: number | "" }) => void;
    onApplyPriceFilter?: () => void;
    search?: string;
    onSearchChange?: (value: string) => void;
}

export function FilterSection({
    showCategory = true,
    showSearch = true,
    showPriceFilter = true,
    showSorting = true,
    orderBy = "createdAt",
    orderDirection = "desc",
    categories = [],
    selectedCategory = "",
    onCategoryChange = () => { },
    onOrderByChange = () => { },
    onOrderDirectionChange = () => { },
    priceRange = { min: "", max: "" },
    onPriceRangeChange = () => { },
    onApplyPriceFilter = () => { },
    search = "",
    onSearchChange = () => { },
}: FilterProps) {
    return (
        <div className="mx-auto max-w-6xl mt-5 mb-10 flex flex-nowrap items-center justify-between gap-5  ">
            {/* Category */}
            {showCategory && (
                <select
                    value={selectedCategory}
                    onChange={(e) => onCategoryChange(e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-3 sf-select"
                >
                    <option value="">All</option>
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                </select>
            )}

            {/* Price Filter */}
            {showPriceFilter && (
                <div className="flex items-center gap-2">
                    <input
                        type="number"
                        placeholder="Min"
                        value={priceRange.min}
                        onChange={(e) =>
                            onPriceRangeChange({
                                ...priceRange,
                                min: e.target.value === "" ? "" : Number(e.target.value),
                            })
                        }
                        className="border border-gray-300 rounded-lg px-3 py-2 w-20"
                    />
                    <span>-</span>
                    <input
                        type="number"
                        placeholder="Max"
                        value={priceRange.max}
                        onChange={(e) =>
                            onPriceRangeChange({
                                ...priceRange,
                                max: e.target.value === "" ? "" : Number(e.target.value),
                            })
                        }
                        className="border border-gray-300 rounded-lg px-3 py-2 w-20"
                    />
                    <button
                        onClick={onApplyPriceFilter}
                        className="bg-green-800 text-white px-4 py-2 rounded-lg hover:bg-green-900 transition-colors"
                    >
                        Apply
                    </button>
                </div>
            )}

            {/* Search */}
            {showSearch && (
                <div className="flex items-center bg-gray-200 rounded-lg px-4 py-2.5 w-80 max-w-sm">
                    <input
                        type="text"
                        placeholder="Search Product"
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="bg-transparent outline-none flex-1 text-sm"
                    />
                    <span className="text-gray-400">🔍</span>
                </div>
            )}

            {/* Sorting */}
            {showSorting && (
                <div className="ml-auto flex gap-3">
                    <select
                        value={orderBy}
                        onChange={(e) => onOrderByChange(e.target.value)}
                        className="bg-white border border-gray-300 px-4 py-3 rounded-lg text-sm hover:border-green-800 sf-select"
                    >
                        <option value="createdAt">Newest</option>
                        <option value="price">Price</option>
                        <option value="stock">Stock</option>
                        <option value="name">Name</option>
                    </select>
                    <select
                        value={orderDirection}
                        onChange={(e) =>
                            onOrderDirectionChange(e.target.value as "asc" | "desc")
                        }
                        className="bg-white border border-gray-300 px-4 py-3 rounded-lg text-sm hover:border-green-800 sf-select"
                    >
                        <option value="desc">Desc</option>
                        <option value="asc">Asc</option>
                    </select>
                </div>
            )}
        </div>
    );
}

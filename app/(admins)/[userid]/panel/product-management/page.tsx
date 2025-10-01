"use client";

import React, { useState, useEffect } from "react";
import { Eye, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { getTokenFromCookies } from "@/utils/apiHelpers";

// Desktop Table Component
const DesktopProductTable = ({
  products,
  onEdit,
  onDelete,
  pagination,
  onPageChange,
}: any) => {
  const formatPrice = (price: any) => `₹${price.toFixed(2)}`;

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Table Header */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          Products - Desktop View
        </h2>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                Pricing
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product: any) => (
              <tr
                key={product._id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={product.images?.[0] || "/placeholder-image.jpg"}
                      alt={product.name}
                      className="h-12 w-12 rounded-lg object-cover"
                    />
                    <div>
                      <div className="font-medium text-gray-900">
                        {product.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {product.category}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col space-y-1">
                    {product.offerPrice > 0 ? (
                      <>
                        <span className="text-lg font-semibold text-green-600">
                          {formatPrice(product.offerPrice)}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          {formatPrice(product.actualPrice)}
                        </span>
                      </>
                    ) : (
                      <span className="text-lg font-semibold text-gray-900">
                        {formatPrice(product.actualPrice)}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                      product.inStock
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.inStock ? "In Stock" : "Out of Stock"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEdit(product)}
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      <Edit size={14} className="mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(product)}
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-red-600 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      <Trash2 size={14} className="mr-1" />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="text-sm text-gray-700">
          Showing {(pagination.currentPage - 1) * 10 + 1} to{" "}
          {Math.min(pagination.currentPage * 10, pagination.totalProducts)} of{" "}
          {pagination.totalProducts} results
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onPageChange(pagination.currentPage - 1)}
            disabled={!pagination.hasPrevPage}
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} className="mr-1" />
            Previous
          </button>

          {Array.from(
            { length: Math.min(pagination.totalPages, 5) },
            (_, i) => {
              const page = i + Math.max(1, pagination.currentPage - 2);
              return page <= pagination.totalPages ? (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    pagination.currentPage === page
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ) : null;
            }
          )}

          <button
            onClick={() => onPageChange(pagination.currentPage + 1)}
            disabled={!pagination.hasNextPage}
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight size={16} className="ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Mobile Cards Component
const MobileProductCards = ({
  products,
  onEdit,
  onDelete,
  pagination,
  onPageChange,
}: any) => {
  const formatPrice = (price: any) => `₹${price.toFixed(2)}`;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Products - Mobile View
        </h2>
      </div>

      {/* Product Cards */}
      <div className="space-y-3">
        {products.map((product: any) => (
          <div
            key={product._id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
          >
            <div className="flex items-start space-x-4">
              {/* Product Image */}
              <img
                src={product.images?.[0] || "/placeholder-image.jpg"}
                alt={product.name}
                className="h-20 w-20 rounded-lg object-cover flex-shrink-0"
              />

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900 text-sm leading-tight flex-1 mr-2">
                    {product.name}
                  </h3>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${
                      product.inStock
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.inStock ? "In Stock" : "Out of Stock"}
                  </span>
                </div>

                {/* Pricing */}
                <div className="flex items-center space-x-2 mb-3">
                  {product.offerPrice > 0 ? (
                    <>
                      <span className="text-lg font-semibold text-green-600">
                        {formatPrice(product.offerPrice)}
                      </span>
                      <span className="text-sm text-gray-500 line-through">
                        {formatPrice(product.actualPrice)}
                      </span>
                    </>
                  ) : (
                    <span className="text-lg font-semibold text-gray-900">
                      {formatPrice(product.actualPrice)}
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEdit(product)}
                    className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    <Edit size={12} className="mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(product)}
                    className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-red-600 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    <Trash2 size={12} className="mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Pagination */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col items-center space-y-4">
          <div className="text-sm text-gray-700">
            Page {pagination.currentPage} of {pagination.totalPages} (
            {pagination.totalProducts} total)
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => onPageChange(pagination.currentPage - 1)}
              disabled={!pagination.hasPrevPage}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
              <span className="ml-1">Previous</span>
            </button>

            <span className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg">
              {pagination.currentPage}
            </span>

            <button
              onClick={() => onPageChange(pagination.currentPage + 1)}
              disabled={!pagination.hasNextPage}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="mr-1">Next</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Utility function to get token from cookies


// Main Component
const ProductListPage = () => {
  const { userid } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [filters, setFilters] = useState({
    category: "",
    inStock: "",
  });

  const router = useRouter();

  // Fetch products from API
  const fetchProducts = async (page = 1) => {
    try {
      setLoading(true);
      setError("");

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(filters.category && { category: filters.category }),
        ...(filters.inStock && { inStock: filters.inStock }),
      });

      // Get token from cookies
      const token = getTokenFromCookies();

      if (!token) {
        setError("Authentication token not found. Please login again.");
        return;
      }
      const response = await fetch(`/api/owner/products/list?${queryParams}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      if (data.success) {
        setProducts(data.data.products);
        setPagination(data.data.pagination);
      } else {
        setError(data.error || "Failed to fetch products");
      }
    } catch (error: any) {
      console.error("Error fetching products:", error);
      setError(error.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  // Delete product
  const handleDelete = async (product: any) => {
    if (!confirm(`Are you sure you want to delete "${product.name}"?`)) {
      return;
    }

    try {
      setDeleteLoading(product._id);

      // Get token from cookies
      const token = getTokenFromCookies();

      if (!token) {
        alert("Authentication token not found. Please login again.");
        return;
      }

      const response = await fetch(
        `/api/owner/products/delete/${product._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      if (data.success) {
        alert("Product deleted successfully!");
        // Refresh the current page
        await fetchProducts(pagination.currentPage);
      } else {
        alert(data.error || "Failed to delete product");
      }
    } catch (error: any) {
      console.error("Error deleting product:", error);
      alert(error.message || "Failed to delete product");
    } finally {
      setDeleteLoading(null);
    }
  };

  // Navigate to edit page
  const handleEdit = (product: any) => {
    router.push(`/${userid}/panel/product-management/edit-view/${product._id}`);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      fetchProducts(page);
    }
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      category: "",
      inStock: "",
    });
    // Fetch products without filters
    setTimeout(() => fetchProducts(1), 0);
  };

  // Load products on component mount
  useEffect(() => {
    fetchProducts();
  }, []); // Remove filters dependency to avoid infinite loop

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            <p className="font-medium">Error: {error}</p>
            <div className="mt-4 space-x-2">
              <button
                onClick={() => fetchProducts()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
              <button
                onClick={() => router.push("/login")}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header with Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Product Management
              </h1>
              <p className="text-gray-600">Manage your store products</p>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() =>
                  router.push(`/${userid}/panel/product-management/create`)
                }
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                + Add Product
              </button>
            </div>
          </div>
        </div>

        {/* Products Display */}
        {products.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg
                className="h-16 w-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-600 mb-4">
              {filters.category || filters.inStock
                ? "No products match your current filters. Try adjusting the filters or create a new product."
                : "Start by creating your first product."}
            </p>
            <div className="space-x-2">
              {(filters.category || filters.inStock) && (
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Clear Filters
                </button>
              )}
              <button
                onClick={() =>
                  router.push(`/${userid}/panel/product-management/create`)
                }
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Create Product
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Desktop View */}
            <div className="hidden lg:block">
              <DesktopProductTable
                products={products}
                onEdit={handleEdit}
                onDelete={handleDelete}
                pagination={pagination}
                onPageChange={handlePageChange}
              />
            </div>

            {/* Mobile View */}
            <div className="lg:hidden">
              <MobileProductCards
                products={products}
                onEdit={handleEdit}
                onDelete={handleDelete}
                pagination={pagination}
                onPageChange={handlePageChange}
              />
            </div>
          </>
        )}

        {/* Delete loading overlay */}
        {deleteLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Deleting product...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductListPage;

"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getTokenFromCookies } from "@/utils/apiHelpers";

const ProductCreatePage = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    actualPrice: "",
    offerPrice: "",
    availableLocation: "",
    category: "",
    inStock: true,
    totalQuantity: "",
    keyFeatures: ["", ""], // Start with 2 mandatory features
  });

  const [productImages, setProductImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const categories = ["popular", "limited", "special"];
  const { userid } = useParams();

  const router = useRouter();

  // Validation function
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // Name validation (10-12 characters)
    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    } else if (formData.name.length < 5 || formData.name.length > 20) {
      newErrors.name = "Product name must be between 5-20 characters";
    }

    // Description validation (150-200 characters)
    if (
      formData.description &&
      (formData.description.length < 10 || formData.description.length > 200)
    ) {
      newErrors.description =
        "Description must be between 10-200 characters if provided";
    }

    // Category validation
    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    // Price validation
    if (!formData.actualPrice || parseFloat(formData.actualPrice) <= 0) {
      newErrors.actualPrice = "Actual price must be greater than 0";
    }

    // Offer price validation
    if (
      formData.offerPrice &&
      parseFloat(formData.offerPrice) >= parseFloat(formData.actualPrice)
    ) {
      newErrors.offerPrice = "Offer price must be less than actual price";
    }

    // Quantity validation
    if (!formData.totalQuantity || parseInt(formData.totalQuantity) <= 0) {
      newErrors.totalQuantity = "Total quantity must be greater than 0";
    }

    // Images validation
    if (productImages.length === 0) {
      newErrors.images = "At least one product image is required";
    }

    // Key features validation
    if (formData.keyFeatures.slice(0, 2).some((feature) => !feature.trim())) {
      newErrors.keyFeatures = "First two features are mandatory";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Image compression function
  const compressImage = async (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;

        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          // Calculate dimensions while maintaining aspect ratio
          let width = img.width;
          let height = img.height;
          const maxWidth = 1200;
          const maxHeight = 1200;

          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          ctx?.drawImage(img, 0, 0, width, height);

          // Compress with quality
          canvas.toBlob(
            (blob) => {
              if (blob) {
                // Create new file from blob
                const compressedFile = new File([blob], file.name, {
                  type: "image/jpeg",
                  lastModified: Date.now(),
                });

                // Check if size is still above 100KB
                if (compressedFile.size > 102400) {
                  // Try again with lower quality
                  canvas.toBlob(
                    (blob2) => {
                      if (blob2) {
                        const finalFile = new File([blob2], file.name, {
                          type: "image/jpeg",
                          lastModified: Date.now(),
                        });
                        resolve(finalFile);
                      } else {
                        reject(new Error("Failed to compress image"));
                      }
                    },
                    "image/jpeg",
                    0.7 // Lower quality if first attempt is still too large
                  );
                } else {
                  resolve(compressedFile);
                }
              } else {
                reject(new Error("Failed to compress image"));
              }
            },
            "image/jpeg",
            0.9 // Initial high quality compression
          );
        };
      };

      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length > 4) {
      alert("Maximum 4 images allowed");
      return;
    }

    setProductImages(files);

    // Create preview URLs
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);

    // Clear image error
    if (errors.images) {
      setErrors((prev) => ({
        ...prev,
        images: "",
      }));
    }
  };

  const removeImage = (index: number) => {
    const newImages = productImages.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);

    setProductImages(newImages);
    setImagePreviews(newPreviews);

    // Cleanup preview URL
    URL.revokeObjectURL(imagePreviews[index]);
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.keyFeatures];
    newFeatures[index] = value;
    setFormData((prev) => ({
      ...prev,
      keyFeatures: newFeatures,
    }));

    // Clear feature error
    if (errors.keyFeatures) {
      setErrors((prev) => ({
        ...prev,
        keyFeatures: "",
      }));
    }
  };

  const addFeature = () => {
    if (formData.keyFeatures.length < 6) {
      setFormData((prev) => ({
        ...prev,
        keyFeatures: [...prev.keyFeatures, ""],
      }));
    }
  };

  const removeFeature = (index: number) => {
    if (formData.keyFeatures.length > 2) {
      const newFeatures = formData.keyFeatures.filter((_, i) => i !== index);
      setFormData((prev) => ({
        ...prev,
        keyFeatures: newFeatures,
      }));
    }
  };
  // Get token from cookies
  const token = getTokenFromCookies();

  if (!token) {
    alert("Authentication token not found. Please login again.");
    return;
  }
  // Upload images to API
  const uploadImages = async (images: File[]): Promise<string[]> => {
    try {
      // Compress images first
      const compressedImages = await Promise.all(
        images.map((image) => compressImage(image))
      );

      // Create FormData
      const formData = new FormData();
      compressedImages.forEach((file) => {
        formData.append("files", file);
      });

      const response = await fetch("http://localhost:3000/api/upload-images", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to upload images");
      }

      const result = await response.json();
      return result.urls;
    } catch (error) {
      console.error("Error uploading images:", error);
      throw error;
    }
  };

  // Create product API call
  const createProduct = async (productData: any) => {
    try {
      const response = await fetch("/api/owner/products/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create product");
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Step 1: Upload images
      console.log("Uploading images...");
      const imageUrls = await uploadImages(productImages);
      console.log("Images uploaded successfully:", imageUrls);

      // Step 2: Prepare product data
      const productData = {
        name: formData.name,
        description: formData.description || "",
        category: formData.category,
        images: imageUrls,
        actualPrice: parseFloat(formData.actualPrice),
        offerPrice: formData.offerPrice ? parseFloat(formData.offerPrice) : 0,
        totalQuantity: parseInt(formData.totalQuantity),
        availableLocation: formData.availableLocation || "",
        inStock: formData.inStock,
        keyFeatures: formData.keyFeatures.filter(
          (feature) => feature.trim() !== ""
        ),
        // Default values as per schema
        totalViews: 0,
        totalBuys: 0,
        softDelete: false,
      };

      // Step 3: Create product
      console.log("Creating product...");
      const result = await createProduct(productData);

      alert("Product created successfully!");

      // Reset form
      setFormData({
        name: "",
        description: "",
        actualPrice: "",
        offerPrice: "",
        availableLocation: "",
        category: "",
        inStock: true,
        totalQuantity: "",
        keyFeatures: ["", ""],
      });
      setProductImages([]);
      setImagePreviews([]);
    } catch (error: any) {
      console.error("Error:", error);
      alert(error.message || "Failed to create product. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-green-100 p-6 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-black">
                Create New Product
              </h1>
              <p className="text-gray-600">
                Add your product details and start selling
              </p>
            </div>
          </div>
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-sm border border-green-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Basic Information
              </h2>
            </div>

            <div className="p-6 space-y-6">
              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Product Name * (10-12 characters)
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-black ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter product name"
                  maxLength={12}
                  required
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
                <p className="text-gray-500 text-xs mt-1">
                  {formData.name.length}/12 characters
                </p>
              </div>

              {/* Product Description */}
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Product Description (150-200 characters)
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none text-black ${
                    errors.description ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Describe your product in detail..."
                  maxLength={200}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description}
                  </p>
                )}
                <p className="text-gray-500 text-xs mt-1">
                  {formData.description.length}/200 characters
                </p>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-black ${
                    errors.category ? "border-red-500" : "border-gray-300"
                  }`}
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                )}
              </div>
            </div>
          </div>

          {/* Product Images */}
          <div className="bg-white rounded-xl shadow-sm border border-green-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Product Images (1-4 images) *
              </h2>
            </div>

            <div className="p-6">
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center hover:border-green-400 transition-colors ${
                  errors.images ? "border-red-500" : "border-gray-300"
                }`}
              >
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="product-images"
                  max={4}
                />
                <label
                  htmlFor="product-images"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <div className="p-3 bg-green-100 rounded-full">
                    <svg
                      className="h-8 w-8 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-black">
                    Click to upload images
                  </span>
                  <span className="text-xs text-gray-500">
                    Maximum 4 images, Min 1 image required
                  </span>
                </label>
              </div>
              {errors.images && (
                <p className="text-red-500 text-sm mt-2">{errors.images}</p>
              )}

              {/* Image Previews */}
              {imagePreviews.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Pricing & Inventory */}
          <div className="bg-white rounded-xl shadow-sm border border-green-100 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
                Pricing & Inventory
              </h2>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Actual Price */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Actual Price *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      ₹
                    </span>
                    <input
                      type="number"
                      name="actualPrice"
                      value={formData.actualPrice}
                      onChange={handleInputChange}
                      className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-black ${
                        errors.actualPrice
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  {errors.actualPrice && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.actualPrice}
                    </p>
                  )}
                </div>

                {/* Offer Price */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Offer Price
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      ₹
                    </span>
                    <input
                      type="number"
                      name="offerPrice"
                      value={formData.offerPrice}
                      onChange={handleInputChange}
                      className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-black ${
                        errors.offerPrice ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  {errors.offerPrice && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.offerPrice}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Total Quantity */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Total Quantity Available *
                  </label>
                  <input
                    type="number"
                    name="totalQuantity"
                    value={formData.totalQuantity}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-black ${
                      errors.totalQuantity
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="0"
                    min="1"
                    required
                  />
                  {errors.totalQuantity && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.totalQuantity}
                    </p>
                  )}
                </div>

                {/* Available Location */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Available Location
                  </label>
                  <input
                    type="text"
                    name="availableLocation"
                    value={formData.availableLocation}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-black"
                    placeholder="e.g., Mumbai, Delhi, Bangalore"
                  />
                </div>
              </div>

              {/* In Stock Toggle */}
              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="inStock"
                    checked={formData.inStock}
                    onChange={handleInputChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
                <span className="text-sm font-medium text-black">
                  Product In Stock
                </span>
              </div>
            </div>
          </div>

          {/* Key Features */}
          <div className="bg-white rounded-xl shadow-sm border border-green-100 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Key Features/Specifications
              </h2>
              <p className="text-orange-100 text-sm mt-1">
                First 2 features are mandatory. You can add up to 6 features.
              </p>
            </div>

            <div className="p-6 space-y-4">
              {formData.keyFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) =>
                        handleFeatureChange(index, e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-black"
                      placeholder={`Feature ${index + 1}${
                        index < 2 ? " (Required)" : ""
                      }`}
                      required={index < 2}
                    />
                  </div>

                  {index >= 2 && (
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
              {errors.keyFeatures && (
                <p className="text-red-500 text-sm">{errors.keyFeatures}</p>
              )}

              {formData.keyFeatures.length < 6 && (
                <button
                  type="button"
                  onClick={addFeature}
                  className="w-full py-3 border-2 border-dashed border-green-300 text-green-600 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors flex items-center justify-center gap-2"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Add Feature
                </button>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button
              type="button"
              onClick={() => router.push(`/${userid}/panel/product-management`)}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating Product...
                </div>
              ) : (
                "Create Product"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductCreatePage;

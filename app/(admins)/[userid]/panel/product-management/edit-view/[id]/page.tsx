"use client";

import React, { useState, useEffect } from "react";
import {
  Eye,
  Edit2,
  Save,
  X,
  Plus,
  Trash2,
  Star,
  TrendingUp,
  ShoppingCart,
  MapPin,
  ArrowLeft,
  Loader2,
  ImageIcon,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { getTokenFromCookies } from "@/utils/apiHelpers";

const ProductEditViewPage = () => {
  const { userid, id } = useParams();
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [imageLoadErrors, setImageLoadErrors] = useState<{
    [key: string]: boolean;
  }>({});

  const [originalData, setOriginalData] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    actualPrice: "",
    offerPrice: "",
    availableLocation: "",
    category: "",
    inStock: true,
    totalViews: 0,
    totalBuyInteraction: 0,
    totalQuantity: "",
    keyFeatures: ["", ""],
  });

  const [productImages, setProductImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);

  const categories = ["popular", "limited", "special"];

  // Get token
  const token = getTokenFromCookies();

  // Handle image load errors
  const handleImageError = (imageUrl: string, isNew: boolean = false) => {
    console.error(`Failed to load image: ${imageUrl}`);
    setImageLoadErrors((prev) => ({
      ...prev,
      [imageUrl]: true,
    }));
  };

  // Fetch product data on component mount
  useEffect(() => {
    if (!token) {
      alert("Authentication token not found. Please login again.");
      router.push("/login");
      return;
    }

    fetchProductData();
  }, [id, token]);

  const fetchProductData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/owner/products/view/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch product data");
      }

      const result = await response.json();

      if (result.success) {
        const product = result.data;

        // Set original data for reset functionality
        setOriginalData(product);

        // Set form data
        setFormData({
          name: product.name || "",
          description: product.description || "",
          actualPrice: product.actualPrice?.toString() || "",
          offerPrice: product.offerPrice?.toString() || "",
          availableLocation: product.availableLocation || "",
          category: product.category || "",
          inStock: product.inStock ?? true,
          totalViews: product.totalViews || 0,
          totalBuyInteraction: product.totalBuys || 0,
          totalQuantity: product.totalQuantity?.toString() || "",
          keyFeatures:
            product.keyFeatures?.length > 0 ? product.keyFeatures : ["", ""],
        });

        // Set product images with error handling
        const validImages = product.images || [];
        console.log("Loaded product images:", validImages);
        setProductImages(validImages);

        // Reset image load errors
        setImageLoadErrors({});
      } else {
        throw new Error(result.message || "Failed to fetch product");
      }
    } catch (error: any) {
      console.error("Error fetching product:", error);
      alert(error.message || "Failed to load product data");
      router.push(`/${userid}/panel/product-management`);
    } finally {
      setIsLoading(false);
    }
  };

  // Validation function
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    } else if (formData.name.length < 5 || formData.name.length > 20) {
      newErrors.name = "Product name must be between 5-20 characters";
    }

    // Description validation
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
    if (productImages.length === 0 && newImages.length === 0) {
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
                const compressedFile = new File([blob], file.name, {
                  type: "image/jpeg",
                  lastModified: Date.now(),
                });

                if (compressedFile.size > 102400) {
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
                    0.7
                  );
                } else {
                  resolve(compressedFile);
                }
              } else {
                reject(new Error("Failed to compress image"));
              }
            },
            "image/jpeg",
            0.9
          );
        };
      };

      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const totalImages = productImages.length + newImages.length + files.length;

    if (totalImages > 4) {
      alert(
        `Maximum 4 images allowed. You can add ${
          4 - productImages.length - newImages.length
        } more images.`
      );
      return;
    }

    setNewImages((prev) => [...prev, ...files]);

    // Create preview URLs for new images
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setNewImagePreviews((prev) => [...prev, ...newPreviews]);

    // Clear the input
    e.target.value = "";

    // Clear image error
    if (errors.images) {
      setErrors((prev) => ({
        ...prev,
        images: "",
      }));
    }
  };

  const removeExistingImage = (index: number) => {
    if (productImages.length + newImages.length > 1) {
      const newImages = productImages.filter((_, i) => i !== index);
      setProductImages(newImages);
    } else {
      alert("At least one image is required");
    }
  };

  const removeNewImage = (index: number) => {
    // Cleanup preview URL
    URL.revokeObjectURL(newImagePreviews[index]);

    const filteredImages = newImages.filter((_, i) => i !== index);
    const filteredPreviews = newImagePreviews.filter((_, i) => i !== index);

    setNewImages(filteredImages);
    setNewImagePreviews(filteredPreviews);
  };

  // Upload new images to API
  const uploadNewImages = async (images: File[]): Promise<string[]> => {
    if (images.length === 0) return [];

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

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);

    try {
      // Step 1: Upload new images if any
      let newImageUrls: string[] = [];
      if (newImages.length > 0) {
        console.log("Uploading new images...");
        newImageUrls = await uploadNewImages(newImages);
      }

      // Step 2: Combine existing and new image URLs
      const allImageUrls = [...productImages, ...newImageUrls];

      // Step 3: Prepare update data
      const updateData = {
        name: formData.name,
        description: formData.description || "",
        category: formData.category,
        images: allImageUrls,
        actualPrice: parseFloat(formData.actualPrice),
        offerPrice: formData.offerPrice ? parseFloat(formData.offerPrice) : 0,
        totalQuantity: parseInt(formData.totalQuantity),
        availableLocation: formData.availableLocation || "",
        inStock: formData.inStock,
        keyFeatures: formData.keyFeatures.filter(
          (feature) => feature.trim() !== ""
        ),
      };

      // Step 4: Update product
      console.log("Updating product...");
      const response = await fetch(`/api/owner/products/edit/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update product");
      }

      const result = await response.json();

      // Update the original data and form data with the response
      setOriginalData(result.data);
      setProductImages(result.data.images || []);

      // Clear new images
      setNewImages([]);
      setNewImagePreviews([]);

      setIsEditing(false);
      alert("Product updated successfully!");

      // Refresh data
      await fetchProductData();
    } catch (error: any) {
      console.error("Error saving product:", error);
      alert(error.message || "Failed to update product. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original values
    if (originalData) {
      setFormData({
        name: originalData.name || "",
        description: originalData.description || "",
        actualPrice: originalData.actualPrice?.toString() || "",
        offerPrice: originalData.offerPrice?.toString() || "",
        availableLocation: originalData.availableLocation || "",
        category: originalData.category || "",
        inStock: originalData.inStock ?? true,
        totalViews: originalData.totalViews || 0,
        totalBuyInteraction: originalData.totalBuys || 0,
        totalQuantity: originalData.totalQuantity?.toString() || "",
        keyFeatures:
          originalData.keyFeatures?.length > 0
            ? originalData.keyFeatures
            : ["", ""],
      });

      setProductImages(originalData.images || []);
    }

    // Clear new images and previews
    newImagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    setNewImages([]);
    setNewImagePreviews([]);
    setErrors({});
    setImageLoadErrors({});
    setIsEditing(false);
  };

  const discountPercentage =
    formData.offerPrice && formData.actualPrice
      ? Math.round(
          ((parseFloat(formData.actualPrice) -
            parseFloat(formData.offerPrice)) /
            parseFloat(formData.actualPrice)) *
            100
        )
      : 0;

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 flex items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <span className="text-lg font-medium text-gray-700">
            Loading product...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() =>
                  router.push(`/${userid}/panel/product-management`)
                }
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl">
                {isEditing ? (
                  <Edit2 className="h-6 w-6 text-white" />
                ) : (
                  <Eye className="h-6 w-6 text-white" />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {isEditing ? "Edit Product" : "Product Details"}
                </h1>
                <p className="text-gray-600">
                  {isEditing
                    ? "Update your product information"
                    : "View and manage your product"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all font-medium shadow-md hover:shadow-lg"
                >
                  <Edit2 className="h-4 w-4" />
                  Edit Product
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all font-medium shadow-md hover:shadow-lg disabled:opacity-50"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className=" text-black grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Product Images & Quick Stats */}
          <div className="lg:col-span-1 space-y-6">
            {/* Product Images */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4">
                <h2 className="text-lg font-semibold text-white">
                  Product Images
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 gap-4">
                  {/* Existing Images */}
                  {productImages.map((image, index) => (
                    <div key={`existing-${index}`} className="relative group">
                      {imageLoadErrors[image] ? (
                        <div className="w-full h-48 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-500">
                              Failed to load image
                            </p>
                            <p className="text-xs text-gray-400 mt-1 break-all px-2">
                              {image}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <img
                          src={image}
                          alt={`Product ${index + 1}`}
                          className="w-full h-48 object-cover rounded-lg border border-gray-200"
                          onError={() => handleImageError(image)}
                          onLoad={() => {
                            console.log(`Image loaded successfully: ${image}`);
                          }}
                          crossOrigin="anonymous"
                          loading="lazy"
                        />
                      )}
                      {isEditing && (
                        <button
                          type="button"
                          onClick={() => removeExistingImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg opacity-0 group-hover:opacity-100"
                          title="Remove Image"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                      {!isEditing && (
                        <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-10 transition-all rounded-lg pointer-events-none"></div>
                      )}
                    </div>
                  ))}

                  {/* New Image Previews */}
                  {newImagePreviews.map((preview, index) => (
                    <div key={`new-${index}`} className="relative group">
                      <img
                        src={preview}
                        alt={`New Product ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg border border-green-300"
                        onLoad={() => {
                          console.log(`New image preview loaded: ${preview}`);
                        }}
                      />
                      <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                        New
                      </div>
                      <button
                        type="button"
                        onClick={() => removeNewImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg opacity-0 group-hover:opacity-100"
                        title="Remove New Image"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add More Images */}
                {isEditing && productImages.length + newImages.length < 4 && (
                  <div className="mt-4">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="add-images"
                    />
                    <label
                      htmlFor="add-images"
                      className="cursor-pointer flex flex-col items-center gap-2 p-6 border-2 border-dashed border-purple-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-all"
                    >
                      <div className="p-3 bg-purple-100 rounded-full">
                        <Plus className="h-6 w-6 text-purple-600" />
                      </div>
                      <span className="text-sm font-medium text-purple-600">
                        Add More Images
                      </span>
                      <span className="text-xs text-gray-500">
                        {4 - productImages.length - newImages.length} more
                        allowed
                      </span>
                    </label>
                  </div>
                )}

                {errors.images && (
                  <p className="text-red-500 text-sm mt-2">{errors.images}</p>
                )}

              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-4">
                <h2 className="text-lg font-semibold text-white">
                  Quick Stats
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">
                      Total Views
                    </span>
                  </div>
                  <span className="text-lg font-bold text-blue-600">
                    {formData.totalViews}
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <ShoppingCart className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium text-gray-700">
                      Buy Interactions
                    </span>
                  </div>
                  <span className="text-lg font-bold text-green-600">
                    {formData.totalBuyInteraction}
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Star className="h-5 w-5 text-purple-600" />
                    <span className="text-sm font-medium text-gray-700">
                      Conversion Rate
                    </span>
                  </div>
                  <span className="text-lg font-bold text-purple-600">
                    {formData.totalViews > 0
                      ? (
                          (formData.totalBuyInteraction / formData.totalViews) *
                          100
                        ).toFixed(1)
                      : "0.0"}
                    %
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Product Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-4">
                <h2 className="text-lg font-semibold text-white">
                  Basic Information
                </h2>
              </div>
              <div className="p-6 space-y-6">
                {/* Product Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name * (5-20 characters)
                  </label>
                  {isEditing ? (
                    <div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                          errors.name ? "border-red-500" : "border-gray-300"
                        }`}
                        maxLength={20}
                        required
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.name}
                        </p>
                      )}
                      <p className="text-gray-500 text-xs mt-1">
                        {formData.name.length}/20 characters
                      </p>
                    </div>
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-gray-900 font-medium">
                        {formData.name}
                      </p>
                    </div>
                  )}
                </div>

                {/* Product Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Description (10-200 characters)
                  </label>
                  {isEditing ? (
                    <div>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={4}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none ${
                          errors.description
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
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
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-gray-700 leading-relaxed">
                        {formData.description || "No description provided"}
                      </p>
                    </div>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  {isEditing ? (
                    <div>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                          errors.category ? "border-red-500" : "border-gray-300"
                        }`}
                        required
                      >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {category.charAt(0).toUpperCase() +
                              category.slice(1)}
                          </option>
                        ))}
                      </select>
                      {errors.category && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.category}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {formData.category.charAt(0).toUpperCase() +
                          formData.category.slice(1)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Pricing & Inventory */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-4">
                <h2 className="text-lg font-semibold text-white">
                  Pricing & Inventory
                </h2>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Actual Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Actual Price *
                    </label>
                    {isEditing ? (
                      <div>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                            ₹
                          </span>
                          <input
                            type="number"
                            name="actualPrice"
                            value={formData.actualPrice}
                            onChange={handleInputChange}
                            className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                              errors.actualPrice
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
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
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-xl font-bold text-gray-900">
                          ₹{formData.actualPrice}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Offer Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Offer Price
                    </label>
                    {isEditing ? (
                      <div>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                            ₹
                          </span>
                          <input
                            type="number"
                            name="offerPrice"
                            value={formData.offerPrice}
                            onChange={handleInputChange}
                            className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                              errors.offerPrice
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
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
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-2">
                          <p className="text-xl font-bold text-green-600">
                            ₹{formData.offerPrice || "N/A"}
                          </p>
                          {discountPercentage > 0 && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              {discountPercentage}% OFF
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Total Quantity */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total Quantity *
                    </label>
                    {isEditing ? (
                      <div>
                        <input
                          type="number"
                          name="totalQuantity"
                          value={formData.totalQuantity}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                            errors.totalQuantity
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          min="1"
                          required
                        />
                        {errors.totalQuantity && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.totalQuantity}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-lg font-medium text-gray-900">
                          {formData.totalQuantity} units
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Stock Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stock Status
                    </label>
                    {isEditing ? (
                      <div className="flex items-center gap-3 px-4 py-3 border border-gray-300 rounded-lg">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="inStock"
                            checked={formData.inStock}
                            onChange={handleInputChange}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                        <span className="text-sm font-medium text-gray-700">
                          In Stock
                        </span>
                      </div>
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            formData.inStock
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {formData.inStock ? "In Stock" : "Out of Stock"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Available Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available Locations
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="availableLocation"
                      value={formData.availableLocation}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="e.g., Mumbai, Delhi, Bangalore"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <p className="text-gray-700">
                          {formData.availableLocation || "Not specified"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Key Features */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4">
                <h2 className="text-lg font-semibold text-white">
                  Key Features
                </h2>
                {isEditing && (
                  <p className="text-orange-100 text-sm mt-1">
                    First 2 features are mandatory. You can add up to 6
                    features.
                  </p>
                )}
              </div>
              <div className="p-6 space-y-4">
                {formData.keyFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex-1">
                      {isEditing ? (
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) =>
                            handleFeatureChange(index, e.target.value)
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder={`Feature ${index + 1}${
                            index < 2 ? " (Required)" : ""
                          }`}
                          required={index < 2}
                        />
                      ) : (
                        <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <p className="text-gray-700">{feature}</p>
                          </div>
                        </div>
                      )}
                    </div>
                    {isEditing && index >= 2 && (
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                ))}

                {errors.keyFeatures && (
                  <p className="text-red-500 text-sm">{errors.keyFeatures}</p>
                )}

                {isEditing && formData.keyFeatures.length < 6 && (
                  <button
                    type="button"
                    onClick={addFeature}
                    className="w-full py-3 border-2 border-dashed border-blue-300 text-blue-600 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="h-5 w-5" />
                    Add Feature
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductEditViewPage;

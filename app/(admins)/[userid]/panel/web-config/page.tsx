"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Save, X, Edit2, ArrowLeft, ImageIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import {
  convertBusinessHoursFromAPI,
  convertBusinessHoursToAPI,
  convertQuickHelpToArray,
  convertQuickHelpToObject,
  defaultConfig,
  WebConfig,
} from "@/app/lib/store.config";
import BasicStoreDetails from "@/component/store-components/BasicStoreDetails";
import AboutUsSection from "@/component/store-components/AboutUs";
import ContactUsSection from "@/component/store-components/StoreContactUs";

// Import the three components

const WebConfigPage = () => {
  const { userid } = useParams();
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [config, setConfig] = useState<WebConfig>(defaultConfig as WebConfig);
  const [originalData, setOriginalData] = useState<any>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");

  // Get token function
  const getTokenFromCookies = () => {
    if (typeof document !== "undefined") {
      const cookies = document.cookie.split(";");
      const tokenCookie = cookies.find((cookie) =>
        cookie.trim().startsWith("token=")
      );
      return tokenCookie ? tokenCookie.split("=")[1] : null;
    }
    return null;
  };

  const token = getTokenFromCookies();

  // Fetch store data on component mount
  useEffect(() => {
    if (!token) {
      alert("Authentication token not found. Please login again.");
      router.push("/login");
      return;
    }

    fetchStoreData();
  }, [token]);

  const fetchStoreData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/owner/fetchStoreWebContent`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          console.log("Store not found, using default configuration");
          setOriginalData(null);
          setConfig(defaultConfig as WebConfig);
          setIsLoading(false);
          return;
        }
        throw new Error("Failed to fetch store data");
      }

      const result = await response.json();

      if (result.success) {
        const storeData = result.data;
        setOriginalData(storeData);

        const mappedConfig: WebConfig = {
          basicDetails: {
            storeName: storeData.displayName || "",
            description: storeData.description || "",
            whatsappNumber: storeData.contact?.whatsAppSupport || "",
            email: storeData.email || "",
            logo: storeData.logo || "",
          },
          contactInfo: {
            getInTouchContent:
              storeData.contact?.getInTouchContent ||
              defaultConfig.contactInfo.getInTouchContent,
            phoneSupport: storeData.contact?.whatsAppSupport || "",
            available24_7: storeData.contact?.available24x7 ?? false,
            emailSupport:
              storeData.contact?.emailSupport || storeData.email || "",
            responseTime:
              storeData.contact?.responseTime || "Response within 24 hours",
            businessHours: storeData.businessHours
              ? convertBusinessHoursFromAPI(storeData.businessHours)
              : defaultConfig.contactInfo.businessHours,
            quickHelpOptions: convertQuickHelpToArray(storeData.quickHelp),
          },
          aboutUs: {
            ourStory:
              storeData.aboutUs?.ourStory || defaultConfig.aboutUs.ourStory,
            ourMission:
              storeData.aboutUs?.mission || defaultConfig.aboutUs.ourMission,
            ourVision:
              storeData.aboutUs?.vision || defaultConfig.aboutUs.ourVision,
            ourValues: {
              trust:
                storeData.aboutUs?.values?.trust ||
                defaultConfig.aboutUs.ourValues.trust,
              excellence:
                storeData.aboutUs?.values?.excellence ||
                defaultConfig.aboutUs.ourValues.excellence,
              sustainability:
                storeData.aboutUs?.values?.sustainability ||
                defaultConfig.aboutUs.ourValues.sustainability,
              community:
                storeData.aboutUs?.values?.community ||
                defaultConfig.aboutUs.ourValues.community,
            },
            whyChooseUs: {
              secureShopping:
                storeData.aboutUs?.whyChooseUs?.secureShopping ||
                defaultConfig.aboutUs.whyChooseUs.secureShopping,
              fastDelivery:
                storeData.aboutUs?.whyChooseUs?.fastDelivery ||
                defaultConfig.aboutUs.whyChooseUs.fastDelivery,
              customerFirst:
                storeData.aboutUs?.whyChooseUs?.customerFirst ||
                defaultConfig.aboutUs.whyChooseUs.customerFirst,
            },
            stats: {
              happyCustomers:
                storeData.aboutUs?.statistics?.happyCustomers ||
                defaultConfig.aboutUs.stats.happyCustomers,
              products:
                storeData.aboutUs?.statistics?.products ||
                defaultConfig.aboutUs.stats.products,
              countriesServed:
                storeData.aboutUs?.statistics?.countriesServed ||
                defaultConfig.aboutUs.stats.countriesServed,
              uptime:
                storeData.aboutUs?.statistics?.uptime ||
                defaultConfig.aboutUs.stats.uptime,
            },
            ourTeam:
              storeData.aboutUs?.ourTeam || defaultConfig.aboutUs.ourTeam,
          },
        };

        setConfig(mappedConfig);
      } else {
        throw new Error(result.message || "Failed to fetch store data");
      }
    } catch (error: any) {
      console.error("Error fetching store data:", error);
      setConfig(defaultConfig);
      setOriginalData(null);
    } finally {
      setIsLoading(false);
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

          let width = img.width;
          let height = img.height;
          const maxWidth = 400;
          const maxHeight = 400;

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

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name, {
                  type: "image/jpeg",
                  lastModified: Date.now(),
                });
                resolve(compressedFile);
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

  // Upload logo image
  const uploadLogoImage = async (file: File): Promise<string> => {
    try {
      const compressedFile = await compressImage(file);
      const formData = new FormData();
      formData.append("files", compressedFile);

      const response = await fetch("http://localhost:3000/api/upload-images", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to upload logo");
      }

      const result = await response.json();
      return result.urls[0];
    } catch (error) {
      console.error("Error uploading logo:", error);
      throw error;
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setErrors({});

    try {
      let logoUrl = config.basicDetails.logo;
      if (logoFile) {
        console.log("Uploading new logo...");
        logoUrl = await uploadLogoImage(logoFile);
      }

      const updateData = {
        displayName: config.basicDetails.storeName,
        description: config.basicDetails.description,
        email: config.basicDetails.email,
        logo: logoUrl,
        contact: {
          getInTouchContent: config.contactInfo.getInTouchContent,
          whatsAppSupport: config.basicDetails.whatsappNumber,
          emailSupport: config.contactInfo.emailSupport,
          available24x7: config.contactInfo.available24_7,
          responseTime: config.contactInfo.responseTime,
        },
        businessHours: convertBusinessHoursToAPI(
          config.contactInfo.businessHours
        ),
        quickHelp: convertQuickHelpToObject(
          config.contactInfo.quickHelpOptions
        ),
        aboutUs: {
          ourStory: config.aboutUs.ourStory,
          mission: config.aboutUs.ourMission,
          vision: config.aboutUs.ourVision,
          values: config.aboutUs.ourValues,
          whyChooseUs: config.aboutUs.whyChooseUs,
          statistics: config.aboutUs.stats,
          ourTeam: config.aboutUs.ourTeam,
        },
      };

      console.log("Updating store...", updateData);
      const response = await fetch("/api/owner/updateWebContent", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update store");
      }

      const result = await response.json();

      setOriginalData(result.data);
      setConfig((prev) => ({
        ...prev,
        basicDetails: {
          ...prev.basicDetails,
          logo: logoUrl,
        },
      }));

      setLogoFile(null);
      setLogoPreview("");
      setIsEditing(false);
      alert("Store configuration updated successfully!");

      await fetchStoreData();
    } catch (error: any) {
      console.error("Error saving store config:", error);
      alert(
        error.message ||
          "Failed to update store configuration. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (originalData) {
      const mappedConfig: WebConfig = {
        basicDetails: {
          storeName: originalData.displayName || "",
          description: originalData.description || "",
          whatsappNumber: originalData.contact?.whatsAppSupport || "",
          email: originalData.email || "",
          logo: originalData.logo || "",
        },
        contactInfo: {
          getInTouchContent:
            originalData.contact?.getInTouchContent ||
            defaultConfig.contactInfo.getInTouchContent,
          phoneSupport: originalData.contact?.whatsAppSupport || "",
          available24_7: originalData.contact?.available24x7 ?? false,
          emailSupport:
            originalData.contact?.emailSupport || originalData.email || "",
          responseTime:
            originalData.contact?.responseTime || "Response within 24 hours",
          businessHours: originalData.businessHours
            ? convertBusinessHoursFromAPI(originalData.businessHours)
            : defaultConfig.contactInfo.businessHours,
          quickHelpOptions: convertQuickHelpToArray(originalData.quickHelp),
        },
        aboutUs: {
          ourStory:
            originalData.aboutUs?.ourStory || defaultConfig.aboutUs.ourStory,
          ourMission:
            originalData.aboutUs?.mission || defaultConfig.aboutUs.ourMission,
          ourVision:
            originalData.aboutUs?.vision || defaultConfig.aboutUs.ourVision,
          ourValues: {
            trust:
              originalData.aboutUs?.values?.trust ||
              defaultConfig.aboutUs.ourValues.trust,
            excellence:
              originalData.aboutUs?.values?.excellence ||
              defaultConfig.aboutUs.ourValues.excellence,
            sustainability:
              originalData.aboutUs?.values?.sustainability ||
              defaultConfig.aboutUs.ourValues.sustainability,
            community:
              originalData.aboutUs?.values?.community ||
              defaultConfig.aboutUs.ourValues.community,
          },
          whyChooseUs: {
            secureShopping:
              originalData.aboutUs?.whyChooseUs?.secureShopping ||
              defaultConfig.aboutUs.whyChooseUs.secureShopping,
            fastDelivery:
              originalData.aboutUs?.whyChooseUs?.fastDelivery ||
              defaultConfig.aboutUs.whyChooseUs.fastDelivery,
            customerFirst:
              originalData.aboutUs?.whyChooseUs?.customerFirst ||
              defaultConfig.aboutUs.whyChooseUs.customerFirst,
          },
          stats: {
            happyCustomers:
              originalData.aboutUs?.statistics?.happyCustomers ||
              defaultConfig.aboutUs.stats.happyCustomers,
            products:
              originalData.aboutUs?.statistics?.products ||
              defaultConfig.aboutUs.stats.products,
            countriesServed:
              originalData.aboutUs?.statistics?.countriesServed ||
              defaultConfig.aboutUs.stats.countriesServed,
            uptime:
              originalData.aboutUs?.statistics?.uptime ||
              defaultConfig.aboutUs.stats.uptime,
          },
          ourTeam:
            originalData.aboutUs?.ourTeam || defaultConfig.aboutUs.ourTeam,
        },
      };
      setConfig(mappedConfig);
    } else {
      setConfig(defaultConfig);
    }

    if (logoPreview) {
      URL.revokeObjectURL(logoPreview);
    }
    setLogoFile(null);
    setLogoPreview("");
    setErrors({});
    setIsEditing(false);
  };

  const handleReset = () => {
    setConfig(defaultConfig);
    setErrors({});

    if (logoPreview) {
      URL.revokeObjectURL(logoPreview);
    }
    setLogoFile(null);
    setLogoPreview("");
  };

  const handleInputChange = (
    section: keyof WebConfig,
    field: string,
    value: any
  ) => {
    setConfig((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleNestedChange = (
    section: keyof WebConfig,
    parentField: string,
    childField: string,
    value: any
  ) => {
    setConfig((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [parentField]: {
          ...prev[section][parentField],
          [childField]: value,
        },
      },
    }));
  };

  const handleBusinessHourChange = (
    day: string,
    field: "enabled" | "hours",
    value: boolean | string
  ) => {
    setConfig((prev) => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        businessHours: {
          ...prev.contactInfo.businessHours,
          [day]: {
            ...prev.contactInfo.businessHours[
              day as keyof typeof prev.contactInfo.businessHours
            ],
            [field]: value,
          },
        },
      },
    }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);

      if (logoPreview) {
        URL.revokeObjectURL(logoPreview);
      }

      const preview = URL.createObjectURL(file);
      setLogoPreview(preview);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 flex items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <span className="text-lg font-medium text-gray-700">
            Loading store configuration...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-black bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push(`/${userid}/panel`)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
                {isEditing ? (
                  <Edit2 className="h-6 w-6 text-white" />
                ) : (
                  <ImageIcon className="h-6 w-6 text-white" />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Store Configuration
                </h1>
                <p className="text-gray-600">
                  {isEditing
                    ? "Update your store information"
                    : "View and manage your store settings"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all font-medium shadow-md hover:shadow-lg"
                >
                  <Edit2 className="h-4 w-4" />
                  Edit Configuration
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleReset}
                    disabled={isSaving}
                    className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                  >
                    Reset to Default
                  </button>
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

        {/* Components */}
        <BasicStoreDetails
          config={config}
          isEditing={isEditing}
          onConfigChange={handleInputChange}
          logoFile={logoFile}
          logoPreview={logoPreview}
          onLogoUpload={handleLogoUpload}
        />

        <ContactUsSection
          config={config}
          isEditing={isEditing}
          onConfigChange={handleInputChange}
          onBusinessHourChange={handleBusinessHourChange}
        />

        <AboutUsSection
          config={config}
          isEditing={isEditing}
          onConfigChange={handleInputChange}
          onNestedChange={handleNestedChange}
        />
      </div>
    </div>
  );
};

export default WebConfigPage;

import React from "react";
import { WebConfig } from "@/app/lib/store.config";

// Helper Components
const InputField = ({
  label,
  value,
  onChange,
  type = "text",
  required = true,
  placeholder = "",
  isEditing,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  isEditing: boolean;
}) => {
  const inputId = `input-${label.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div className="mb-4">
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {isEditing ? (
        <input
          id={inputId}
          type={type}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder={placeholder}
          required={required}
        />
      ) : (
        <div className="px-3 py-2 bg-gray-50 rounded-md text-gray-800">
          {value || "Not set"}
        </div>
      )}
    </div>
  );
};

const TextAreaField = ({
  label,
  value,
  onChange,
  rows = 3,
  required = true,
  isEditing,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  required?: boolean;
  isEditing: boolean;
}) => {
  const textareaId = `textarea-${label.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div className="mb-4">
      <label
        htmlFor={textareaId}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {isEditing ? (
        <textarea
          id={textareaId}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          required={required}
        />
      ) : (
        <div className="px-3 py-2 bg-gray-50 rounded-md text-gray-800 whitespace-pre-wrap">
          {value || "Not set"}
        </div>
      )}
    </div>
  );
};

interface BasicStoreDetailsProps {
  config: WebConfig;
  isEditing: boolean;
  onConfigChange: (section: keyof WebConfig, field: string, value: any) => void;
  logoFile: File | null;
  logoPreview: string;
  onLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const BasicStoreDetails: React.FC<BasicStoreDetailsProps> = ({
  config,
  isEditing,
  onConfigChange,
  logoFile,
  logoPreview,
  onLogoUpload,
}) => {
  const ImageUploadField = ({ label, value, required = false }: any) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {isEditing ? (
        <div className="space-y-3">
          <input
            type="file"
            accept="image/*"
            onChange={onLogoUpload}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          {(logoPreview || value) && (
            <div className="mt-2">
              <img
                src={logoPreview || value}
                alt="Logo preview"
                className="max-w-32 max-h-32 object-contain border border-gray-300 rounded-md"
                onError={() => console.error("Logo preview failed to load")}
              />
              {logoPreview && (
                <p className="text-sm text-green-600 mt-1">New logo selected</p>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="px-3 py-2 bg-gray-50 rounded-md">
          {value ? (
            <img
              src={value}
              alt="Logo"
              className="max-w-32 max-h-32 object-contain"
              onError={() => console.error("Logo failed to load")}
            />
          ) : (
            <span className="text-gray-500">No logo uploaded</span>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Basic Store Details
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="Store/Website Name"
          value={config.basicDetails.storeName}
          onChange={(value: string) =>
            onConfigChange("basicDetails", "storeName", value)
          }
          isEditing={isEditing}
        />
        <InputField
          label="Email"
          value={config.basicDetails.email}
          onChange={(value: string) =>
            onConfigChange("basicDetails", "email", value)
          }
          type="email"
          required={false}
          isEditing={isEditing}
        />
        <InputField
          label="WhatsApp Number"
          value={config.basicDetails.whatsappNumber}
          onChange={(value: string) =>
            onConfigChange("basicDetails", "whatsappNumber", value)
          }
          type="tel"
          isEditing={isEditing}
        />
        <ImageUploadField
          label="Logo"
          value={config.basicDetails.logo}
          required={false}
        />
      </div>
      <TextAreaField
        label="Description"
        value={config.basicDetails.description}
        onChange={(value: string) =>
          onConfigChange("basicDetails", "description", value)
        }
        rows={3}
        isEditing={isEditing}
      />
    </div>
  );
};

export default BasicStoreDetails;

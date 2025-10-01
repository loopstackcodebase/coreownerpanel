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

interface AboutUsSectionProps {
  config: WebConfig;
  isEditing: boolean;
  onConfigChange: (section: keyof WebConfig, field: string, value: any) => void;
  onNestedChange: (
    section: keyof WebConfig,
    parentField: string,
    childField: string,
    value: any
  ) => void;
}

const AboutUsSection: React.FC<AboutUsSectionProps> = ({
  config,
  isEditing,
  onConfigChange,
  onNestedChange,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">About Us</h2>

      <TextAreaField
        label="Our Story"
        value={config.aboutUs.ourStory}
        onChange={(value: string) =>
          onConfigChange("aboutUs", "ourStory", value)
        }
        rows={4}
        isEditing={isEditing}
      />

      <TextAreaField
        label="Our Mission"
        value={config.aboutUs.ourMission}
        onChange={(value: string) =>
          onConfigChange("aboutUs", "ourMission", value)
        }
        rows={4}
        isEditing={isEditing}
      />

      <TextAreaField
        label="Our Vision"
        value={config.aboutUs.ourVision}
        onChange={(value: string) =>
          onConfigChange("aboutUs", "ourVision", value)
        }
        rows={4}
        isEditing={isEditing}
      />

      <h3 className="text-lg font-medium text-gray-900 mb-3 mt-6">
        Our Values
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextAreaField
          label="Trust"
          value={config.aboutUs.ourValues.trust}
          onChange={(value: string) =>
            onNestedChange("aboutUs", "ourValues", "trust", value)
          }
          rows={3}
          isEditing={isEditing}
        />
        <TextAreaField
          label="Excellence"
          value={config.aboutUs.ourValues.excellence}
          onChange={(value: string) =>
            onNestedChange("aboutUs", "ourValues", "excellence", value)
          }
          rows={3}
          isEditing={isEditing}
        />
        <TextAreaField
          label="Sustainability"
          value={config.aboutUs.ourValues.sustainability}
          onChange={(value: string) =>
            onNestedChange("aboutUs", "ourValues", "sustainability", value)
          }
          rows={3}
          isEditing={isEditing}
        />
        <TextAreaField
          label="Community"
          value={config.aboutUs.ourValues.community}
          onChange={(value: string) =>
            onNestedChange("aboutUs", "ourValues", "community", value)
          }
          rows={3}
          isEditing={isEditing}
        />
      </div>

      <h3 className="text-lg font-medium text-gray-900 mb-3 mt-6">
        Why Choose Us?
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <TextAreaField
          label="Secure Shopping"
          value={config.aboutUs.whyChooseUs.secureShopping}
          onChange={(value: string) =>
            onNestedChange("aboutUs", "whyChooseUs", "secureShopping", value)
          }
          rows={3}
          isEditing={isEditing}
        />
        <TextAreaField
          label="Fast Delivery"
          value={config.aboutUs.whyChooseUs.fastDelivery}
          onChange={(value: string) =>
            onNestedChange("aboutUs", "whyChooseUs", "fastDelivery", value)
          }
          rows={3}
          isEditing={isEditing}
        />
        <TextAreaField
          label="Customer First"
          value={config.aboutUs.whyChooseUs.customerFirst}
          onChange={(value: string) =>
            onNestedChange("aboutUs", "whyChooseUs", "customerFirst", value)
          }
          rows={3}
          isEditing={isEditing}
        />
      </div>

      <h3 className="text-lg font-medium text-gray-900 mb-3 mt-6">
        Statistics
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <InputField
          label="Happy Customers"
          value={config.aboutUs.stats.happyCustomers}
          onChange={(value: string) =>
            onNestedChange("aboutUs", "stats", "happyCustomers", value)
          }
          placeholder="e.g., 10K+"
          isEditing={isEditing}
        />
        <InputField
          label="Products"
          value={config.aboutUs.stats.products}
          onChange={(value: string) =>
            onNestedChange("aboutUs", "stats", "products", value)
          }
          placeholder="e.g., 500+"
          isEditing={isEditing}
        />
        <InputField
          label="Countries Served"
          value={config.aboutUs.stats.countriesServed}
          onChange={(value: string) =>
            onNestedChange("aboutUs", "stats", "countriesServed", value)
          }
          placeholder="e.g., 50+"
          isEditing={isEditing}
        />
        <InputField
          label="Uptime"
          value={config.aboutUs.stats.uptime}
          onChange={(value: string) =>
            onNestedChange("aboutUs", "stats", "uptime", value)
          }
          placeholder="e.g., 99.9%"
          isEditing={isEditing}
        />
      </div>

      <TextAreaField
        label="Our Team"
        value={config.aboutUs.ourTeam}
        onChange={(value: string) =>
          onConfigChange("aboutUs", "ourTeam", value)
        }
        rows={4}
        isEditing={isEditing}
      />
    </div>
  );
};

export default AboutUsSection;

// import React from "react";
// import { WebConfig } from "@/app/lib/store.config";

// // Helper Components
// const InputField = ({
//   label,
//   value,
//   onChange,
//   type = "text",
//   required = true,
//   placeholder = "",
//   isEditing,
// }: {
//   label: string;
//   value: string;
//   onChange: (value: string) => void;
//   type?: string;
//   required?: boolean;
//   placeholder?: string;
//   isEditing: boolean;
// }) => {
//   const inputId = `input-${label.replace(/\s+/g, "-").toLowerCase()}`;

//   return (
//     <div className="mb-4">
//       <label
//         htmlFor={inputId}
//         className="block text-sm font-medium text-gray-700 mb-2"
//       >
//         {label} {required && <span className="text-red-500">*</span>}
//       </label>
//       {isEditing ? (
//         <input
//           id={inputId}
//           type={type}
//           value={value || ""}
//           onChange={(e) => onChange(e.target.value)}
//           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
//           placeholder={placeholder}
//           required={required}
//         />
//       ) : (
//         <div className="px-3 py-2 bg-gray-50 rounded-md text-gray-800">
//           {value || "Not set"}
//         </div>
//       )}
//     </div>
//   );
// };

// const TextAreaField = ({
//   label,
//   value,
//   onChange,
//   rows = 3,
//   required = true,
//   isEditing,
// }: {
//   label: string;
//   value: string;
//   onChange: (value: string) => void;
//   rows?: number;
//   required?: boolean;
//   isEditing: boolean;
// }) => {
//   const textareaId = `textarea-${label.replace(/\s+/g, "-").toLowerCase()}`;

//   return (
//     <div className="mb-4">
//       <label
//         htmlFor={textareaId}
//         className="block text-sm font-medium text-gray-700 mb-2"
//       >
//         {label} {required && <span className="text-red-500">*</span>}
//       </label>
//       {isEditing ? (
//         <textarea
//           id={textareaId}
//           value={value || ""}
//           onChange={(e) => onChange(e.target.value)}
//           rows={rows}
//           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
//           required={required}
//         />
//       ) : (
//         <div className="px-3 py-2 bg-gray-50 rounded-md text-gray-800 whitespace-pre-wrap">
//           {value || "Not set"}
//         </div>
//       )}
//     </div>
//   );
// };

// const CheckboxField = ({
//   label,
//   value,
//   onChange,
//   isEditing,
// }: {
//   label: string;
//   value: boolean;
//   onChange: (value: boolean) => void;
//   isEditing: boolean;
// }) => (
//   <div className="mb-4">
//     <label className="flex items-center space-x-2">
//       {isEditing ? (
//         <input
//           type="checkbox"
//           checked={value}
//           onChange={(e) => onChange(e.target.checked)}
//           className="rounded border-gray-300 text-green-600 focus:ring-green-500"
//         />
//       ) : (
//         <div
//           className={`w-4 h-4 rounded border ${
//             value ? "bg-green-500 border-green-500" : "border-gray-300"
//           }`}
//         >
//           {value && <div className="text-white text-xs">✓</div>}
//         </div>
//       )}
//       <span className="text-sm font-medium text-gray-700">{label}</span>
//     </label>
//   </div>
// );

// interface ContactUsSectionProps {
//   config: WebConfig;
//   isEditing: boolean;
//   onConfigChange: (section: keyof WebConfig, field: string, value: any) => void;
//   onBusinessHourChange: (
//     day: string,
//     field: "enabled" | "hours",
//     value: boolean | string
//   ) => void;
// }

// const ContactUsSection: React.FC<ContactUsSectionProps> = ({
//   config,
//   isEditing,
//   onConfigChange,
//   onBusinessHourChange,
// }) => {
//   const MultiSelectField = ({
//     label,
//     value,
//     onChange,
//     options,
//   }: {
//     label: string;
//     value: string[];
//     onChange: (value: string[]) => void;
//     options: { value: string; label: string }[];
//   }) => {
//     const safeValue = Array.isArray(value) ? value : [];

//     return (
//       <div className="mb-4">
//         <label className="block text-sm font-medium text-gray-700 mb-2">
//           {label}
//         </label>
//         <div className="space-y-2">
//           {options.map((option: any) => (
//             <label key={option.value} className="flex items-center space-x-2">
//               {isEditing ? (
//                 <input
//                   type="checkbox"
//                   checked={safeValue.includes(option.value)}
//                   onChange={(e) => {
//                     if (e.target.checked) {
//                       onChange([...safeValue, option.value]);
//                     } else {
//                       onChange(
//                         safeValue.filter((v: string) => v !== option.value)
//                       );
//                     }
//                   }}
//                   className="rounded border-gray-300 text-green-600 focus:ring-green-500"
//                 />
//               ) : (
//                 <div
//                   className={`w-4 h-4 rounded border ${
//                     safeValue.includes(option.value)
//                       ? "bg-green-500 border-green-500"
//                       : "border-gray-300"
//                   }`}
//                 >
//                   {safeValue.includes(option.value) && (
//                     <div className="text-white text-xs">✓</div>
//                   )}
//                 </div>
//               )}
//               <span className="text-sm text-gray-700">{option.label}</span>
//             </label>
//           ))}
//         </div>
//       </div>
//     );
//   };

//   const BusinessHourField = ({
//     day,
//     data,
//   }: {
//     day: string;
//     data: { enabled: boolean; hours: string };
//   }) => {
//     const hoursInputId = `hours-${day}`;

//     return (
//       <div className="mb-4 p-4 border border-gray-200 rounded-lg">
//         <div className="flex items-center space-x-3 mb-2">
//           {isEditing ? (
//             <input
//               type="checkbox"
//               checked={data.enabled}
//               onChange={(e) =>
//                 onBusinessHourChange(day, "enabled", e.target.checked)
//               }
//               className="rounded border-gray-300 text-green-600 focus:ring-green-500"
//             />
//           ) : (
//             <div
//               className={`w-4 h-4 rounded border ${
//                 data.enabled
//                   ? "bg-green-500 border-green-500"
//                   : "border-gray-300"
//               }`}
//             >
//               {data.enabled && <div className="text-white text-xs">✓</div>}
//             </div>
//           )}
//           <span className="text-sm font-medium text-gray-700 capitalize">
//             {day}
//           </span>
//         </div>

//         {data.enabled && (
//           <div className="ml-7">
//             {isEditing ? (
//               <input
//                 id={hoursInputId}
//                 type="text"
//                 value={data.hours || ""}
//                 onChange={(e) =>
//                   onBusinessHourChange(day, "hours", e.target.value)
//                 }
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                 placeholder="e.g., 9:00 AM - 6:00 PM"
//               />
//             ) : (
//               <div className="px-3 py-2 bg-gray-50 rounded-md text-gray-800">
//                 {data.hours}
//               </div>
//             )}
//           </div>
//         )}

//         {!data.enabled && (
//           <div className="ml-7">
//             <div className="px-3 py-2 bg-red-50 rounded-md text-red-600 font-medium">
//               Closed
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
//       <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Us</h2>

//       <TextAreaField
//         label="Get in Touch Content"
//         value={config.contactInfo.getInTouchContent}
//         onChange={(value: string) =>
//           onConfigChange("contactInfo", "getInTouchContent", value)
//         }
//         rows={4}
//         isEditing={isEditing}
//       />

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <InputField
//           label="Phone Support"
//           value={config.contactInfo.phoneSupport}
//           onChange={(value: string) =>
//             onConfigChange("contactInfo", "phoneSupport", value)
//           }
//           type="tel"
//           isEditing={isEditing}
//         />
//         <InputField
//           label="Email Support"
//           value={config.contactInfo.emailSupport}
//           onChange={(value: string) =>
//             onConfigChange("contactInfo", "emailSupport", value)
//           }
//           type="email"
//           isEditing={isEditing}
//         />
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <CheckboxField
//           label="Available 24/7"
//           value={config.contactInfo.available24_7}
//           onChange={(value: boolean) =>
//             onConfigChange("contactInfo", "available24_7", value)
//           }
//           isEditing={isEditing}
//         />
//         <InputField
//           label="Response Time"
//           value={config.contactInfo.responseTime}
//           onChange={(value: string) =>
//             onConfigChange("contactInfo", "responseTime", value)
//           }
//           isEditing={isEditing}
//         />
//       </div>

//       <h3 className="text-lg font-medium text-gray-900 mb-4 mt-6">
//         Business Hours
//       </h3>
//       <p className="text-sm text-gray-600 mb-4">
//         Select the days you're open and set your hours. Uncheck days when you're
//         closed.
//       </p>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         {Object.entries(config.contactInfo.businessHours).map(([day, data]) => (
//           <BusinessHourField key={day} day={day} data={data} />
//         ))}
//       </div>

//       <MultiSelectField
//         label="Quick Help Options"
//         value={config.contactInfo.quickHelpOptions}
//         onChange={(value: string[]) =>
//           onConfigChange("contactInfo", "quickHelpOptions", value)
//         }
//         options={[
//           { value: "live_chat", label: "Live Chat Support" },
//           { value: "technical_support", label: "Technical Support" },
//           { value: "account_help", label: "Account Help" },
//         ]}
//       />
//     </div>
//   );
// };

// export default ContactUsSection;

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

const CheckboxField = ({
  label,
  value,
  onChange,
  isEditing,
}: {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
  isEditing: boolean;
}) => (
  <div className="mb-4">
    <label className="flex items-center space-x-2">
      {isEditing ? (
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
        />
      ) : (
        <div
          className={`w-4 h-4 rounded border ${
            value ? "bg-green-500 border-green-500" : "border-gray-300"
          }`}
        >
          {value && <div className="text-white text-xs">✓</div>}
        </div>
      )}
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </label>
  </div>
);

interface ContactUsSectionProps {
  config: WebConfig;
  isEditing: boolean;
  onConfigChange: (section: keyof WebConfig, field: string, value: any) => void;
  onBusinessHourChange: (
    day: string,
    field: "enabled" | "hours",
    value: boolean | string
  ) => void;
}

const StoreContactUsSection: React.FC<ContactUsSectionProps> = ({
  config,
  isEditing,
  onConfigChange,
  onBusinessHourChange,
}) => {
  const MultiSelectField = ({
    label,
    value,
    onChange,
    options,
  }: {
    label: string;
    value: string[];
    onChange: (value: string[]) => void;
    options: { value: string; label: string }[];
  }) => {
    const safeValue = Array.isArray(value) ? value : [];

    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
        <div className="space-y-2">
          {options.map((option: any) => (
            <label key={option.value} className="flex items-center space-x-2">
              {isEditing ? (
                <input
                  type="checkbox"
                  checked={safeValue.includes(option.value)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      onChange([...safeValue, option.value]);
                    } else {
                      onChange(
                        safeValue.filter((v: string) => v !== option.value)
                      );
                    }
                  }}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
              ) : (
                <div
                  className={`w-4 h-4 rounded border ${
                    safeValue.includes(option.value)
                      ? "bg-green-500 border-green-500"
                      : "border-gray-300"
                  }`}
                >
                  {safeValue.includes(option.value) && (
                    <div className="text-white text-xs">✓</div>
                  )}
                </div>
              )}
              <span className="text-sm text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>
      </div>
    );
  };

  const BusinessHourField = ({
    day,
    data,
  }: {
    day: string;
    data: { enabled: boolean; hours: string };
  }) => {
    const dropdownId = `dropdown-${day}`;

    return (
      <div className="mb-4 p-4 border border-gray-200 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700 capitalize">
            {day}
          </span>

          {isEditing ? (
            <select
              id={dropdownId}
              value={data.enabled ? "open" : "closed"}
              onChange={(e) =>
                onBusinessHourChange(day, "enabled", e.target.value === "open")
              }
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
          ) : (
            <div
              className={`px-3 py-2 rounded-md font-medium ${
                data.enabled
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {data.enabled ? "Open" : "Closed"}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Us</h2>

      <TextAreaField
        label="Get in Touch Content"
        value={config.contactInfo.getInTouchContent}
        onChange={(value: string) =>
          onConfigChange("contactInfo", "getInTouchContent", value)
        }
        rows={4}
        isEditing={isEditing}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="Phone Support"
          value={config.contactInfo.phoneSupport}
          onChange={(value: string) =>
            onConfigChange("contactInfo", "phoneSupport", value)
          }
          type="tel"
          isEditing={isEditing}
        />
        <InputField
          label="Email Support"
          value={config.contactInfo.emailSupport}
          onChange={(value: string) =>
            onConfigChange("contactInfo", "emailSupport", value)
          }
          type="email"
          isEditing={isEditing}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CheckboxField
          label="Available 24/7"
          value={config.contactInfo.available24_7}
          onChange={(value: boolean) =>
            onConfigChange("contactInfo", "available24_7", value)
          }
          isEditing={isEditing}
        />
        <InputField
          label="Response Time"
          value={config.contactInfo.responseTime}
          onChange={(value: string) =>
            onConfigChange("contactInfo", "responseTime", value)
          }
          isEditing={isEditing}
        />
      </div>

      <h3 className="text-lg font-medium text-gray-900 mb-4 mt-6">
        Business Hours
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(config.contactInfo.businessHours).map(([day, data]) => (
          <BusinessHourField key={day} day={day} data={data} />
        ))}
      </div>

      <MultiSelectField
        label="Quick Help Options"
        value={config.contactInfo.quickHelpOptions}
        onChange={(value: string[]) =>
          onConfigChange("contactInfo", "quickHelpOptions", value)
        }
        options={[
          { value: "live_chat", label: "Live Chat Support" },
          { value: "technical_support", label: "Technical Support" },
          { value: "account_help", label: "Account Help" },
        ]}
      />
    </div>
  );
};

export default StoreContactUsSection;

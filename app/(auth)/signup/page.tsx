// "use client";

// import React, { useState } from "react";
// import { CheckCircle, User, Store, ArrowRight, ArrowLeft } from "lucide-react";

// const OnboardingSignup = () => {
//   const [currentStep, setCurrentStep] = useState(0);
//   const [formData, setFormData] = useState({
//     username: "",
//     phoneNumber: "",
//     password: "",
//     confirmPassword: "",
//     type: "owner",
//   });
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");

//   const steps = [
//     {
//       id: "welcome",
//       title: "Welcome! 🚀",
//       subtitle: "Join thousands of successful stores",
//       component: "welcome",
//     },
//     {
//       id: "basic",
//       title: "Create Account",
//       subtitle: "Setup your store account",
//       component: "basic",
//     },
//     {
//       id: "password",
//       title: "Secure Account",
//       subtitle: "Set your password",
//       component: "password",
//     },
//   ];

//   const handleInputChange = (field: any, value: any) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//     // Clear error when user starts typing
//     if (error) setError("");
//   };

//   const handleNext = () => {
//     if (currentStep < steps.length - 1) {
//       setCurrentStep(currentStep + 1);
//     }
//   };

//   const handlePrevious = () => {
//     if (currentStep > 0) {
//       setCurrentStep(currentStep - 1);
//     }
//   };

//   const handleSubmit = async () => {
//     if (formData.password !== formData.confirmPassword) {
//       setError("Passwords do not match");
//       return;
//     }

//     setIsLoading(true);
//     setError("");

//     try {
//       const response = await fetch("/api/auth/onboard", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           username: formData.username,
//           phoneNumber: formData.phoneNumber,
//           password: formData.password,
//           type: formData.type,
//         }),
//       });

//       const data = await response.json();

//       if (data.success) {
//         // Store token in localStorage (or handle as needed)
//         if (typeof window !== "undefined") {
//           localStorage.setItem("token", data.data.token);
//           localStorage.setItem("user", JSON.stringify(data.data.user));
//         }

//         // Redirect to user dashboard
//         window.location.href = `/${data.data.user.username}`;
//       } else {
//         setError(data.message || "Registration failed");
//       }
//     } catch (error) {
//       console.error("Registration error:", error);
//       setError("Network error. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const isStepValid = () => {
//     const step = steps[currentStep];
//     switch (step.id) {
//       case "basic":
//         return formData.username.trim() && formData.phoneNumber.trim();
//       case "password":
//         return (
//           formData.password.trim() &&
//           formData.confirmPassword.trim() &&
//           formData.password === formData.confirmPassword &&
//           formData.password.length >= 6
//         );
//       default:
//         return true;
//     }
//   };

//   const renderWelcome = () => (
//     <div className="text-center space-y-4">
//       <div className="relative mb-4">
//         <div className="bg-gradient-to-r from-green-400 to-green-600 w-16 h-16 rounded-full mx-auto flex items-center justify-center shadow-lg">
//           <Store className="w-8 h-8 text-white" />
//         </div>
//         <div className="absolute -top-1 -right-1 bg-yellow-400 w-6 h-6 rounded-full flex items-center justify-center">
//           <span className="text-sm">✨</span>
//         </div>
//       </div>

//       <div className="space-y-2">
//         <h2 className="text-xl md:text-2xl font-bold text-gray-900">
//           Welcome to Your Store Journey! 🚀
//         </h2>
//         <p className="text-sm text-gray-600 leading-relaxed">
//           Join thousands of successful store owners. Create your complete
//           e-commerce store in just 5 minutes!
//         </p>
//       </div>

//       <div className="bg-gradient-to-r from-green-50 to-green-100 p-3 rounded-lg border border-green-200">
//         <div className="grid grid-cols-3 gap-3 text-xs">
//           <div className="flex flex-col items-center">
//             <div className="bg-green-500 p-1.5 rounded-full mb-1">
//               <CheckCircle className="w-3 h-3 text-white" />
//             </div>
//             <p className="font-medium text-gray-900">Easy Setup</p>
//             <p className="text-gray-600">5 minutes</p>
//           </div>
//           <div className="flex flex-col items-center">
//             <div className="bg-green-500 p-1.5 rounded-full mb-1">
//               <CheckCircle className="w-3 h-3 text-white" />
//             </div>
//             <p className="font-medium text-gray-900">Complete</p>
//             <p className="text-gray-600">All included</p>
//           </div>
//           <div className="flex flex-col items-center">
//             <div className="bg-green-500 p-1.5 rounded-full mb-1">
//               <CheckCircle className="w-3 h-3 text-white" />
//             </div>
//             <p className="font-medium text-gray-900">Success</p>
//             <p className="text-gray-600">Start today</p>
//           </div>
//         </div>
//       </div>

//       <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg border border-blue-100">
//         <div className="flex items-center justify-center space-x-2">
//           <span className="text-lg">💡</span>
//           <p className="text-xs font-medium text-gray-800">
//             "Make your business online, showcase the smart way"
//           </p>
//         </div>
//       </div>
//     </div>
//   );

//   const renderBasicInfo = () => (
//     <div className="space-y-4">
//       <div className="text-center space-y-2">
//         <div className="bg-gradient-to-r from-green-400 to-green-600 w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-2">
//           <User className="w-6 h-6 text-white" />
//         </div>
//         <h2 className="text-xl font-bold text-gray-900">Create Your Account</h2>
//         <p className="text-sm text-gray-600">Enter your basic details</p>
//       </div>

//       {error && (
//         <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
//           {error}
//         </div>
//       )}

//       <div className="space-y-3">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Store Name *
//           </label>
//           <input
//             type="text"
//             value={formData.username}
//             onChange={(e) => handleInputChange("username", e.target.value)}
//             placeholder="e.g., John's Fashion Store"
//             className="w-full px-3 py-2 border-2 border-transparent bg-gradient-to-r from-green-50 to-green-100 focus:border-green-400 focus:bg-white rounded-lg outline-none transition-all duration-300 text-sm text-black"
//           />
//           <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-3 rounded-lg border border-yellow-300 mt-2">
//             <div className="flex items-start space-x-2">
//               <span className="text-lg">⚠️</span>
//               <div>
//                 <p className="text-xs font-medium text-yellow-800">
//                   Important!
//                 </p>
//                 <p className="text-xs text-yellow-700">
//                   Based on this store name, your store will be showcased. Enter
//                   your business name carefully as this will be your store
//                   identity.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Phone Number *
//           </label>
//           <input
//             type="tel"
//             value={formData.phoneNumber}
//             onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
//             placeholder="+91 12345 67890"
//             className="w-full px-3 py-2 border-2 border-transparent bg-gradient-to-r from-green-50 to-green-100 focus:border-green-400 focus:bg-white rounded-lg outline-none transition-all duration-300 text-sm text-black"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Account Type
//           </label>
//           <select
//             value={formData.type}
//             onChange={(e) => handleInputChange("type", e.target.value)}
//             className="w-full px-3 py-2 border-2 border-transparent bg-gradient-to-r from-green-50 to-green-100 focus:border-green-400 focus:bg-white rounded-lg outline-none transition-all duration-300 text-sm text-black"
//           >
//             <option value="owner">Store Owner</option>
//           </select>
//         </div>
//       </div>

//       <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-3 rounded-lg border border-yellow-200">
//         <div className="flex items-center space-x-2">
//           <span className="text-lg">🎯</span>
//           <div>
//             <p className="text-xs font-medium text-gray-800">Pro Tip!</p>
//             <p className="text-xs text-gray-600">
//               Choose a unique username for your store
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const renderPasswordStep = () => (
//     <div className="space-y-4">
//       <div className="text-center space-y-2">
//         <div className="bg-gradient-to-r from-purple-400 to-purple-600 w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-2">
//           <CheckCircle className="w-6 h-6 text-white" />
//         </div>
//         <h2 className="text-xl font-bold text-gray-900">Secure Your Account</h2>
//         <p className="text-sm text-gray-600">Create a strong password</p>
//       </div>

//       {error && (
//         <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
//           {error}
//         </div>
//       )}

//       <div className="space-y-3">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Password *
//           </label>
//           <input
//             type="password"
//             value={formData.password}
//             onChange={(e) => handleInputChange("password", e.target.value)}
//             placeholder="Enter your password"
//             className="w-full px-3 py-2 border-2 border-transparent bg-gradient-to-r from-green-50 to-green-100 focus:border-green-400 focus:bg-white rounded-lg outline-none transition-all duration-300 text-sm text-black"
//           />
//           <p className="text-xs text-gray-500 mt-1">At least 6 characters</p>
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Confirm Password *
//           </label>
//           <input
//             type="password"
//             value={formData.confirmPassword}
//             onChange={(e) =>
//               handleInputChange("confirmPassword", e.target.value)
//             }
//             placeholder="Confirm your password"
//             className="w-full px-3 py-2 border-2 border-transparent bg-gradient-to-r from-green-50 to-green-100 focus:border-green-400 focus:bg-white rounded-lg outline-none transition-all duration-300 text-sm text-black"
//           />
//           {formData.confirmPassword &&
//             formData.password !== formData.confirmPassword && (
//               <p className="text-xs text-red-500 mt-1">
//                 Passwords do not match
//               </p>
//             )}
//         </div>
//       </div>

//       <div className="bg-gradient-to-r from-green-50 to-green-100 p-3 rounded-lg border border-green-200">
//         <div className="text-center space-y-2">
//           <div className="text-2xl">🎉</div>
//           <h3 className="text-sm font-semibold text-gray-900">Almost Ready!</h3>
//           <p className="text-xs text-gray-600">
//             Your store will be created and you'll be redirected to your
//             dashboard.
//           </p>
//         </div>
//       </div>
//     </div>
//   );

//   const renderStepContent = () => {
//     const step = steps[currentStep];
//     switch (step.component) {
//       case "welcome":
//         return renderWelcome();
//       case "basic":
//         return renderBasicInfo();
//       case "password":
//         return renderPasswordStep();
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
//       <div className="w-full max-w-md mx-auto">
//         {/* Progress Bar */}
//         <div className="mb-4">
//           <div className="flex items-center justify-between">
//             {steps.map((step, index) => (
//               <div
//                 key={step.id}
//                 className={`flex items-center ${
//                   index < steps.length - 1 ? "flex-1" : ""
//                 }`}
//               >
//                 <div
//                   className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
//                     index <= currentStep
//                       ? "bg-green-500 text-white"
//                       : "bg-gray-200 text-gray-500"
//                   }`}
//                 >
//                   {index < currentStep ? (
//                     <CheckCircle className="w-4 h-4" />
//                   ) : (
//                     index + 1
//                   )}
//                 </div>
//                 {index < steps.length - 1 && (
//                   <div
//                     className={`flex-1 h-0.5 mx-2 ${
//                       index < currentStep ? "bg-green-500" : "bg-gray-200"
//                     }`}
//                   />
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className="bg-white rounded-xl shadow-lg p-6">
//           {renderStepContent()}
//         </div>

//         {/* Navigation Buttons */}
//         <div className="flex justify-between items-center mt-4 gap-3">
//           {currentStep > 0 ? (
//             <button
//               onClick={handlePrevious}
//               disabled={isLoading}
//               className="flex items-center px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition-all duration-300 text-sm disabled:opacity-50"
//             >
//               <ArrowLeft className="w-4 h-4 mr-1" />
//               Previous
//             </button>
//           ) : (
//             <div />
//           )}

//           {currentStep < steps.length - 1 ? (
//             <button
//               onClick={handleNext}
//               disabled={!isStepValid()}
//               className={`flex items-center px-6 py-2 rounded-lg font-medium transition-all duration-300 text-sm ${
//                 isStepValid()
//                   ? "bg-green-500 text-white hover:bg-green-600 shadow-md hover:shadow-lg"
//                   : "bg-gray-300 text-gray-500 cursor-not-allowed"
//               }`}
//             >
//               Next
//               <ArrowRight className="w-4 h-4 ml-1" />
//             </button>
//           ) : (
//             <button
//               onClick={handleSubmit}
//               disabled={!isStepValid() || isLoading}
//               className={`flex items-center px-6 py-2 rounded-lg font-medium transition-all duration-300 text-sm ${
//                 isStepValid() && !isLoading
//                   ? "bg-green-500 text-white hover:bg-green-600 shadow-md hover:shadow-lg"
//                   : "bg-gray-300 text-gray-500 cursor-not-allowed"
//               }`}
//             >
//               {isLoading ? "Creating..." : "Create Store! 🚀"}
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OnboardingSignup;

"use client";

import React, { useState } from "react";
import {
  CheckCircle,
  User,
  Store,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";

// Validation functions
const validateUsername = (username: string): string | null => {
  if (!username) return "Store name is required";
  if (username.length > 15) return "Store name must be 15 characters or less";
  if (!/^[a-z0-9]+$/.test(username))
    return "Only lowercase letters and numbers allowed, no spaces";
  return null;
};

const validatePhone = (phone: string): string | null => {
  if (!phone) return "Phone number is required";
  const cleanPhone = phone.replace(/\D/g, "");
  if (cleanPhone.length !== 10) return "Phone number must be exactly 10 digits";
  return null;
};

const validatePassword = (password: string): string | null => {
  if (!password) return "Password is required";
  if (password.length < 6) return "Password must be at least 6 characters";
  if (!/(?=.*[a-z])/.test(password))
    return "Password must contain at least one lowercase letter";
  if (!/(?=.*[A-Z])/.test(password))
    return "Password must contain at least one uppercase letter";
  if (!/(?=.*\d)/.test(password))
    return "Password must contain at least one number";
  if (!/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\?])/.test(password))
    return "Password must contain at least one special character";
  return null;
};

const validateConfirmPassword = (
  password: string,
  confirmPassword: string
): string | null => {
  if (!confirmPassword) return "Please confirm your password";
  if (password !== confirmPassword) return "Passwords do not match";
  return null;
};

interface FormData {
  username: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  type: string;
}

interface ValidationErrors {
  username?: string;
  phoneNumber?: string;
  password?: string;
  confirmPassword?: string;
}

const OnboardingSignup = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    username: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    type: "owner",
  });
  const [validationErrors, setValidationErrors]: any =
    useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const steps = [
    {
      id: "welcome",
      title: "Welcome! 🚀",
      subtitle: "Join thousands of successful stores",
      component: "welcome",
    },
    {
      id: "basic",
      title: "Create Account",
      subtitle: "Setup your store account",
      component: "basic",
    },
    {
      id: "password",
      title: "Secure Account",
      subtitle: "Set your password",
      component: "password",
    },
  ];

  const validateField = (
    field: keyof FormData,
    value: string
  ): string | null => {
    switch (field) {
      case "username":
        return validateUsername(value);
      case "phoneNumber":
        return validatePhone(value);
      case "password":
        return validatePassword(value);
      case "confirmPassword":
        return validateConfirmPassword(formData.password, value);
      default:
        return null;
    }
  };

  const validateCurrentStep = (): boolean => {
    const step = steps[currentStep];
    let isValid = true;
    const errors: ValidationErrors = {};

    switch (step.id) {
      case "basic":
        const usernameError = validateField("username", formData.username);
        const phoneError = validateField("phoneNumber", formData.phoneNumber);

        if (usernameError) {
          errors.username = usernameError;
          isValid = false;
        }
        if (phoneError) {
          errors.phoneNumber = phoneError;
          isValid = false;
        }
        break;

      case "password":
        const passwordError = validateField("password", formData.password);
        const confirmPasswordError = validateField(
          "confirmPassword",
          formData.confirmPassword
        );

        if (passwordError) {
          errors.password = passwordError;
          isValid = false;
        }
        if (confirmPasswordError) {
          errors.confirmPassword = confirmPasswordError;
          isValid = false;
        }
        break;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    let processedValue = value;

    // Process input based on field type
    if (field === "username") {
      processedValue = value
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "")
        .slice(0, 15);
    } else if (field === "phoneNumber") {
      processedValue = value.replace(/\D/g, "").slice(0, 10);
    }

    setFormData((prev) => ({
      ...prev,
      [field]: processedValue,
    }));

    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors((prev: ValidationErrors) => ({
        ...prev,
        [field]: undefined,
      }));
    }

    // Clear general error when user starts typing
    if (error) setError("");
  };

  const handleNext = () => {
    if (validateCurrentStep() && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) {
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/onboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          phoneNumber: formData.phoneNumber,
          password: formData.password,
          type: formData.type,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Store token in localStorage (or handle as needed)
        if (typeof window !== "undefined") {
          // Store token in cookie
          document.cookie = `token=${data.data.token}; path=/; max-age=${
            60 * 60 * 24 * 7
          }; secure; samesite=strict`;

          // Store user info in cookie (optional)
          document.cookie = `user-info=${JSON.stringify(
            data.data.user
          )}; path=/; max-age=${60 * 60 * 24 * 7}; secure; samesite=strict`;

          // Redirect to admin panel using the user ID
          router.push(`/${data.data.user.username}/panel`);
        }

        // Redirect to user dashboard
        window.location.href = `/${data.data.user.username}/panel`;
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const isStepValid = (): boolean => {
    const step = steps[currentStep];
    switch (step.id) {
      case "basic":
        return (
          !validateField("username", formData.username) &&
          !validateField("phoneNumber", formData.phoneNumber)
        );
      case "password":
        return (
          !validateField("password", formData.password) &&
          !validateField("confirmPassword", formData.confirmPassword)
        );
      default:
        return true;
    }
  };

  const renderValidationError = (field: keyof FormData) => {
    if (validationErrors[field]) {
      return (
        <div className="flex items-center mt-1 text-red-600">
          <AlertCircle className="w-3 h-3 mr-1" />
          <p className="text-xs">{validationErrors[field]}</p>
        </div>
      );
    }
    return null;
  };

  const renderWelcome = () => (
    <div className="text-center space-y-4">
      <div className="relative mb-4">
        <div className="bg-gradient-to-r from-green-400 to-green-600 w-16 h-16 rounded-full mx-auto flex items-center justify-center shadow-lg">
          <Store className="w-8 h-8 text-white" />
        </div>
        <div className="absolute -top-1 -right-1 bg-yellow-400 w-6 h-6 rounded-full flex items-center justify-center">
          <span className="text-sm">✨</span>
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">
          Welcome to Your Store Journey! 🚀
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          Join thousands of successful store owners. Create your complete
          e-commerce store in just 5 minutes!
        </p>
      </div>

      <div className="bg-gradient-to-r from-green-50 to-green-100 p-3 rounded-lg border border-green-200">
        <div className="grid grid-cols-3 gap-3 text-xs">
          <div className="flex flex-col items-center">
            <div className="bg-green-500 p-1.5 rounded-full mb-1">
              <CheckCircle className="w-3 h-3 text-white" />
            </div>
            <p className="font-medium text-gray-900">Easy Setup</p>
            <p className="text-gray-600">5 minutes</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-green-500 p-1.5 rounded-full mb-1">
              <CheckCircle className="w-3 h-3 text-white" />
            </div>
            <p className="font-medium text-gray-900">Complete</p>
            <p className="text-gray-600">All included</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-green-500 p-1.5 rounded-full mb-1">
              <CheckCircle className="w-3 h-3 text-white" />
            </div>
            <p className="font-medium text-gray-900">Success</p>
            <p className="text-gray-600">Start today</p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg border border-blue-100">
        <div className="flex items-center justify-center space-x-2">
          <span className="text-lg">💡</span>
          <p className="text-xs font-medium text-gray-800">
            "Make your business online, showcase the smart way"
          </p>
        </div>
      </div>
    </div>
  );

  const renderBasicInfo = () => (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <div className="bg-gradient-to-r from-green-400 to-green-600 w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-2">
          <User className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Create Your Account</h2>
        <p className="text-sm text-gray-600">Enter your basic details</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Store Name *{" "}
            <span className="text-xs text-gray-500">
              ({formData.username.length}/15)
            </span>
          </label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) => handleInputChange("username", e.target.value)}
            placeholder="johnsfashion"
            className={`w-full px-3 py-2 border-2 bg-gradient-to-r from-green-50 to-green-100 focus:bg-white rounded-lg outline-none transition-all duration-300 text-sm text-black ${
              validationErrors.username
                ? "border-red-300 focus:border-red-400"
                : "border-transparent focus:border-green-400"
            }`}
          />
          {renderValidationError("username")}
          <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-3 rounded-lg border border-yellow-300 mt-2">
            <div className="flex items-start space-x-2">
              <span className="text-lg">⚠️</span>
              <div>
                <p className="text-xs font-medium text-yellow-800">
                  Important!
                </p>
                <p className="text-xs text-yellow-700">
                  Only lowercase letters and numbers. No spaces or special
                  characters. Max 15 characters.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number *{" "}
            <span className="text-xs text-gray-500">
              ({formData.phoneNumber.length}/10)
            </span>
          </label>
          <input
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
            placeholder="1234567890"
            className={`w-full px-3 py-2 border-2 bg-gradient-to-r from-green-50 to-green-100 focus:bg-white rounded-lg outline-none transition-all duration-300 text-sm text-black ${
              validationErrors.phoneNumber
                ? "border-red-300 focus:border-red-400"
                : "border-transparent focus:border-green-400"
            }`}
          />
          {renderValidationError("phoneNumber")}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Account Type
          </label>
          <select
            value={formData.type}
            onChange={(e) => handleInputChange("type", e.target.value)}
            className="w-full px-3 py-2 border-2 border-transparent bg-gradient-to-r from-green-50 to-green-100 focus:border-green-400 focus:bg-white rounded-lg outline-none transition-all duration-300 text-sm text-black"
          >
            <option value="owner">Store Owner</option>
          </select>
        </div>
      </div>

      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-3 rounded-lg border border-yellow-200">
        <div className="flex items-center space-x-2">
          <span className="text-lg">🎯</span>
          <div>
            <p className="text-xs font-medium text-gray-800">Pro Tip!</p>
            <p className="text-xs text-gray-600">
              Choose a unique username for your store
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPasswordStep = () => (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <div className="bg-gradient-to-r from-purple-400 to-purple-600 w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-2">
          <CheckCircle className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Secure Your Account</h2>
        <p className="text-sm text-gray-600">Create a strong password</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password *
          </label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            placeholder="Enter your password"
            className={`w-full px-3 py-2 border-2 bg-gradient-to-r from-green-50 to-green-100 focus:bg-white rounded-lg outline-none transition-all duration-300 text-sm text-black ${
              validationErrors.password
                ? "border-red-300 focus:border-red-400"
                : "border-transparent focus:border-green-400"
            }`}
          />
          {renderValidationError("password")}
          <div className="mt-2 space-y-1">
            <p className="text-xs text-gray-600">Password must contain:</p>
            <div className="grid grid-cols-2 gap-1 text-xs">
              <div
                className={`flex items-center ${
                  formData.password.length >= 6
                    ? "text-green-600"
                    : "text-gray-500"
                }`}
              >
                <CheckCircle className="w-3 h-3 mr-1" />
                6+ characters
              </div>
              <div
                className={`flex items-center ${
                  /(?=.*[a-z])/.test(formData.password)
                    ? "text-green-600"
                    : "text-gray-500"
                }`}
              >
                <CheckCircle className="w-3 h-3 mr-1" />
                Lowercase letter
              </div>
              <div
                className={`flex items-center ${
                  /(?=.*[A-Z])/.test(formData.password)
                    ? "text-green-600"
                    : "text-gray-500"
                }`}
              >
                <CheckCircle className="w-3 h-3 mr-1" />
                Uppercase letter
              </div>
              <div
                className={`flex items-center ${
                  /(?=.*\d)/.test(formData.password)
                    ? "text-green-600"
                    : "text-gray-500"
                }`}
              >
                <CheckCircle className="w-3 h-3 mr-1" />
                Number
              </div>
              <div
                className={`flex items-center col-span-2 ${
                  /(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\?])/.test(
                    formData.password
                  )
                    ? "text-green-600"
                    : "text-gray-500"
                }`}
              >
                <CheckCircle className="w-3 h-3 mr-1" />
                Special character (!@#$%^&*)
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password *
          </label>
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) =>
              handleInputChange("confirmPassword", e.target.value)
            }
            placeholder="Confirm your password"
            className={`w-full px-3 py-2 border-2 bg-gradient-to-r from-green-50 to-green-100 focus:bg-white rounded-lg outline-none transition-all duration-300 text-sm text-black ${
              validationErrors.confirmPassword
                ? "border-red-300 focus:border-red-400"
                : "border-transparent focus:border-green-400"
            }`}
          />
          {renderValidationError("confirmPassword")}
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-50 to-green-100 p-3 rounded-lg border border-green-200">
        <div className="text-center space-y-2">
          <div className="text-2xl">🎉</div>
          <h3 className="text-sm font-semibold text-gray-900">Almost Ready!</h3>
          <p className="text-xs text-gray-600">
            Your store will be created and you'll be redirected to your
            dashboard.
          </p>
        </div>
      </div>
    </div>
  );

  const renderStepContent = () => {
    const step = steps[currentStep];
    switch (step.component) {
      case "welcome":
        return renderWelcome();
      case "basic":
        return renderBasicInfo();
      case "password":
        return renderPasswordStep();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center ${
                  index < steps.length - 1 ? "flex-1" : ""
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                    index <= currentStep
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {index < currentStep ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 ${
                      index < currentStep ? "bg-green-500" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-4 gap-3">
          {currentStep > 0 ? (
            <button
              onClick={handlePrevious}
              disabled={isLoading}
              className="flex items-center px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition-all duration-300 text-sm disabled:opacity-50"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Previous
            </button>
          ) : (
            <div />
          )}

          {currentStep < steps.length - 1 ? (
            <button
              onClick={handleNext}
              disabled={!isStepValid()}
              className={`flex items-center px-6 py-2 rounded-lg font-medium transition-all duration-300 text-sm ${
                isStepValid()
                  ? "bg-green-500 text-white hover:bg-green-600 shadow-md hover:shadow-lg"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Next
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!isStepValid() || isLoading}
              className={`flex items-center px-6 py-2 rounded-lg font-medium transition-all duration-300 text-sm ${
                isStepValid() && !isLoading
                  ? "bg-green-500 text-white hover:bg-green-600 shadow-md hover:shadow-lg"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {isLoading ? "Creating..." : "Create Store! 🚀"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingSignup;

"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";

const LinksPage = () => {
  const [copiedLink, setCopiedLink] = useState(null);
  const { userid } = useParams<{ userid: string }>();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const links = [
    {
      id: "products",
      title: "User Products List",
      description:
        "Share this link with your customers to showcase your products",
      url: `${baseUrl}/${userid}/products`,
      icon: (
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
      ),
      color: "bg-blue-500",
      hoverColor: "hover:bg-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-700",
      purpose: "Customer Access",
    },
    {
      id: "admin",
      title: "Admin Panel",
      description: "Access your admin dashboard to manage your store",
      url: `${baseUrl}/${userid}/panel`,
      icon: (
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      color: "bg-green-500",
      hoverColor: "hover:bg-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      textColor: "text-green-700",
      purpose: "Admin Access",
    },
    {
      id: "login",
      title: "Login",
      description: "Save this URL for quick access to your login page",
      url: `${baseUrl}/login`,
      icon: (
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
          />
        </svg>
      ),
      color: "bg-purple-500",
      hoverColor: "hover:bg-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      textColor: "text-purple-700",
      purpose: "Authentication",
    },
    {
      id: "register",
      title: "Register",
      description: "Share this link with people who need to create a store",
      url: `${baseUrl}/register`,
      icon: (
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
          />
        </svg>
      ),
      color: "bg-orange-500",
      hoverColor: "hover:bg-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      textColor: "text-orange-700",
      purpose: "Registration",
    },
  ];

  const copyToClipboard = async (url: any, id: any) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedLink(id);
      setTimeout(() => setCopiedLink(null), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-green-100 rounded-lg">
            <svg
              className="h-6 w-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Quick Access Links
          </h1>
        </div>
        <p className="text-gray-600">
          Save and share these important links for convenient access to your
          store features
        </p>
      </div>

      {/* Links Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {links.map((link) => (
          <div
            key={link.id}
            className={`bg-white rounded-lg shadow-sm border-2 ${link.borderColor} ${link.bgColor} transition-all duration-200 hover:shadow-md`}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 ${link.color} text-white rounded-lg`}>
                    {link.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {link.title}
                    </h3>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${link.bgColor} ${link.textColor} font-medium`}
                    >
                      {link.purpose}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                {link.description}
              </p>

              {/* URL Display */}
              <div className="bg-gray-50 rounded-lg p-3 mb-4 border border-gray-200">
                <div className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 text-gray-400 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  <code className="text-sm text-gray-700 font-mono break-all">
                    {link.url}
                  </code>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => copyToClipboard(link.url, link.id)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 ${link.color} ${link.hoverColor} text-white text-sm font-medium rounded-lg transition-colors`}
                >
                  {copiedLink === link.id ? (
                    <>
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                      Copy Link
                    </>
                  )}
                </button>

                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  Visit
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Usage Tips */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
            <svg
              className="h-5 w-5 text-blue-600"
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
          </div>
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Usage Tips
            </h3>
            <ul className="text-blue-700 space-y-1 text-sm">
              <li>
                • Bookmark the <strong>Admin Panel</strong> and{" "}
                <strong>Login</strong> links for quick access
              </li>
              <li>
                • Share the <strong>Products List</strong> link with your
                customers via social media or email
              </li>
              <li>
                • Send the <strong>Register</strong> link to anyone who needs to
                create their own store
              </li>
              <li>
                • Use the copy button to quickly save these links for later use
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinksPage;

"use client";

import React, { useState, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";

const QRCodeGenerator = () => {
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [storeName, setStoreName] = useState("");
  const [generatedQR, setGeneratedQR] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const qrRef: any = useRef(null);

  const validateURL = (string: any) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const generateQRCode = () => {
    if (!url.trim()) {
      alert("Please enter a URL");
      return;
    }

    if (!validateURL(url)) {
      alert("Please enter a valid URL");
      return;
    }

    setIsGenerating(true);

    // Simulate generation delay for better UX
    setTimeout(() => {
      setGeneratedQR(url);
      setIsGenerating(false);
    }, 800);
  };

  const downloadQRCodePDF = async () => {
    if (!generatedQR) return;

    setIsDownloading(true);

    try {
      // Create a canvas to render the QR code
      const canvas = document.createElement("canvas");
      const ctx: any = canvas.getContext("2d");

      // Set canvas size for PDF (A4 proportions)
      canvas.width = 595;
      canvas.height = 842;

      // White background
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Get QR code SVG
      const qrSvg = qrRef.current.querySelector("svg");
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(qrSvg);

      // Create image from SVG
      const img = new Image();
      const svgBlob = new Blob([svgString], {
        type: "image/svg+xml;charset=utf-8",
      });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        // Draw title
        ctx.fillStyle = "#1f2937";
        ctx.font = "bold 32px Arial";
        ctx.textAlign = "center";
        ctx.fillText(storeName, canvas.width / 2, 80);

        // Draw QR code (centered)
        const qrSize = 300;
        const qrX = (canvas.width - qrSize) / 2;
        const qrY = 120;
        ctx.drawImage(img, qrX, qrY, qrSize, qrSize);

        // Draw description if provided
        if (description.trim()) {
          ctx.font = "18px Arial";
          ctx.fillStyle = "#4b5563";
          ctx.textAlign = "center";

          // Word wrap for description
          const words = description.split(" ");
          const lines = [];
          let currentLine = "";

          for (let word of words) {
            const testLine = currentLine + word + " ";
            const metrics = ctx.measureText(testLine);
            if (metrics.width > canvas.width - 100 && currentLine !== "") {
              lines.push(currentLine);
              currentLine = word + " ";
            } else {
              currentLine = testLine;
            }
          }
          lines.push(currentLine);

          // Draw description lines
          let startY = qrY + qrSize + 40;
          lines.forEach((line, index) => {
            ctx.fillText(line.trim(), canvas.width / 2, startY + index * 25);
          });
        }

        // Draw URL at bottom
        ctx.font = "14px Arial";
        ctx.fillStyle = "#6b7280";
        ctx.textAlign = "center";
        ctx.fillText(generatedQR, canvas.width / 2, canvas.height - 40);

        // Convert canvas to blob and download
        canvas.toBlob((blob: any) => {
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = `${storeName.replace(/\s+/g, "_")}_QR_Code.png`;
          link.click();

          URL.revokeObjectURL(url);
          setIsDownloading(false);
        }, "image/png");
      };

      img.src = url;
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating download. Please try again.");
      setIsDownloading(false);
    }
  };

  const clearQRCode = () => {
    setUrl("");
    setDescription("");
    setStoreName("");
    setGeneratedQR("");
  };

  return (
    <div className="text-black max-w-4xl mx-auto space-y-6">
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
                d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M12 20h4.01M12 16h4.01M16 8h4.01M12 8h.01M8 12h.01M12 4h.01M8 8h.01"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              QR Code Generator
            </h1>
            <p className="text-gray-600">
              Generate QR codes for your links with custom descriptions
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            QR Code Details
          </h2>

          <div className="space-y-4">
            {/* URL Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website URL *
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              />
            </div>

            {/* Store Name (Always shown, not editable) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Store Name (Optional)
              </label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="Enter your store or business name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              />
              <p className="text-xs text-gray-500 mt-1">
                This will appear as the title on your QR code
              </p>
            </div>

            {/* Description Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., Visit our website for special offers, Contact us for support, etc."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors resize-none"
              />
            </div>

            {/* Generate Button */}
            <button
              onClick={generateQRCode}
              disabled={isGenerating || !url.trim()}
              className="w-full bg-green-600 text-white py-2.5 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Generating...
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
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Generate QR Code
                </>
              )}
            </button>
          </div>
        </div>

        {/* QR Code Preview Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              QR Code Preview
            </h2>
            {generatedQR && (
              <button
                onClick={clearQRCode}
                className="text-gray-500 hover:text-red-500 transition-colors"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>

          {generatedQR ? (
            <div className="text-center space-y-4">
              <div
                className="bg-gray-50 rounded-lg p-6 inline-block"
                ref={qrRef}
              >
                <QRCodeSVG
                  value={generatedQR}
                  size={200}
                  level="H"
                  includeMargin={true}
                  bgColor="#ffffff"
                  fgColor="#000000"
                />
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <strong>Store:</strong> {storeName}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>URL:</strong> {generatedQR}
                </p>
                {description && (
                  <p className="text-sm text-gray-600">
                    <strong>Description:</strong> {description}
                  </p>
                )}
              </div>

              <button
                onClick={downloadQRCodePDF}
                disabled={isDownloading}
                className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
              >
                {isDownloading ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Preparing Download...
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
                        d="M12 10v6m0 0l-4-4m4 4l4-4m-4-4V4m0 0L8 8m4-4l4 4"
                      />
                    </svg>
                    Download as Image
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="text-center py-12">
              <svg
                className="h-16 w-16 text-gray-300 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M12 20h4.01M12 16h4.01M16 8h4.01M12 8h.01M8 12h.01M12 4h.01M8 8h.01"
                />
              </svg>
              <p className="text-gray-500">
                Enter a URL and click "Generate QR Code" to see preview
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
        <h3 className="text-sm font-medium text-blue-900 mb-2">
          Instructions:
        </h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>1. Enter a valid URL (must start with http:// or https://)</li>
          <li>
            2. Add an optional description to explain the QR code's purpose
          </li>
          <li>3. Click "Generate QR Code" to create the code</li>
          <li>
            4. Download the QR code as an image with your store name and
            description
          </li>
        </ul>
      </div>
    </div>
  );
};

export default QRCodeGenerator;

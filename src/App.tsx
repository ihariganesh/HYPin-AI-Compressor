import React, { useState, useEffect } from "react";
import { FileProcessor } from "./utils/fileProcessor";

export interface ProcessedFile {
  id: string;
  originalFile: File;
  compressedFile?: File;
  originalSize: number;
  compressedSize?: number;
  compressionRatio?: number;
  status: "pending" | "processing" | "completed" | "error";
  error?: string;
  selected?: boolean;
}

function App() {
  const [files, setFiles] = useState<ProcessedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [compressionLevel, setCompressionLevel] = useState<
    "low" | "medium" | "high"
  >("medium");
  const [processor] = useState(() => new FileProcessor());

  useEffect(() => {
    const completedCount = files.filter((f) => f.status === "completed").length;
    const processingCount = files.filter(
      (f) => f.status === "processing"
    ).length;

    if (processingCount > 0) {
      document.title = `⚙️ Processing ${processingCount} file${
        processingCount !== 1 ? "s" : ""
      } - HYPin Compress`;
    } else if (completedCount > 0) {
      document.title = `✅ ${completedCount} file${
        completedCount !== 1 ? "s" : ""
      } compressed - HYPin Compress`;
    } else if (files.length > 0) {
      document.title = `📁 ${files.length} file${
        files.length !== 1 ? "s" : ""
      } ready - HYPin Compress`;
    } else {
      document.title = "HYPin Compress - Advanced Media Compression";
    }
  }, [files]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (fileList) {
      const newFiles = Array.from(fileList).map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        originalFile: file,
        originalSize: file.size,
        status: "pending" as const,
        selected: true,
      }));
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const fileList = event.dataTransfer.files;
    if (fileList) {
      const newFiles = Array.from(fileList).map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        originalFile: file,
        originalSize: file.size,
        status: "pending" as const,
        selected: true,
      }));
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const toggleFileSelection = (fileId: string) => {
    setFiles((prev) =>
      prev.map((file) =>
        file.id === fileId ? { ...file, selected: !file.selected } : file
      )
    );
  };

  const toggleSelectAll = () => {
    const pendingFiles = files.filter((f) => f.status === "pending");
    const allPendingSelected = pendingFiles.every((f) => f.selected);

    setFiles((prev) =>
      prev.map((file) =>
        file.status === "pending"
          ? { ...file, selected: !allPendingSelected }
          : file
      )
    );
  };

  const removeFile = (fileId: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== fileId));
  };

  const downloadFile = (file: ProcessedFile) => {
    if (!file.compressedFile) return;

    // Create a custom filename prompt
    const defaultName = file.compressedFile.name;
    const userFileName = prompt(`Choose filename for download:`, defaultName);

    // If user cancels or provides empty name, use default
    const finalFileName = userFileName?.trim() || defaultName;

    const url = URL.createObjectURL(file.compressedFile);
    const a = document.createElement("a");
    a.href = url;
    a.download = finalFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearCompletedFiles = () => {
    setFiles((prev) => prev.filter((file) => file.status !== "completed"));
  };

  const downloadAllCompleted = () => {
    const completedFiles = files.filter(
      (f) => f.status === "completed" && f.compressedFile
    );

    if (completedFiles.length === 0) return;

    const confirmDownload = confirm(
      `Download all ${completedFiles.length} compressed files?\n\nNote: Files will be downloaded to your browser's default download folder.`
    );

    if (confirmDownload) {
      completedFiles.forEach((file, index) => {
        // Add small delay between downloads to avoid browser blocking
        setTimeout(() => {
          if (file.compressedFile) {
            const url = URL.createObjectURL(file.compressedFile);
            const a = document.createElement("a");
            a.href = url;
            a.download = file.compressedFile.name;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }
        }, index * 200); // 200ms delay between each download
      });
    }
  };

  const compressFiles = async () => {
    setIsProcessing(true);

    // Only compress selected files that are pending
    const filesToCompress = files.filter(
      (f) => f.selected && f.status === "pending"
    );

    try {
      for (const file of filesToCompress) {
        // Update status to processing
        setFiles((prev) =>
          prev.map((f) =>
            f.id === file.id ? { ...f, status: "processing" } : f
          )
        );

        try {
          const compressedFile = await processor.processFile(
            file.originalFile,
            compressionLevel
          );
          const compressionRatio =
            ((file.originalSize - compressedFile.size) / file.originalSize) *
            100;

          // Update with success
          setFiles((prev) =>
            prev.map((f) =>
              f.id === file.id
                ? {
                    ...f,
                    status: "completed",
                    compressedFile,
                    compressedSize: compressedFile.size,
                    compressionRatio,
                    selected: false, // Deselect after compression
                  }
                : f
            )
          );
        } catch (error) {
          // Update with error
          setFiles((prev) =>
            prev.map((f) =>
              f.id === file.id
                ? {
                    ...f,
                    status: "error",
                    error:
                      error instanceof Error
                        ? error.message
                        : "Compression failed",
                    selected: false, // Deselect after error
                  }
                : f
            )
          );
        }
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-grid"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold gradient-text mb-8">
            HYPin Compress
          </h1>
          <p className="text-xl text-slate-400">
            Advanced Media Compression with AI-Powered Optimization
          </p>

          <div className="mt-16 space-y-12 max-w-6xl mx-auto">
            {/* File Upload Area */}
            <div
              className="upload-area border-2 border-dashed border-slate-600 hover:border-blue-400/50 transition-all duration-300 p-8 lg:p-12 text-center rounded-xl"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <div className="mb-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-violet-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>
              </div>

              <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">
                Upload Media Files
              </h3>

              <p className="text-slate-400 mb-8 lg:text-lg">
                Drag & drop your files or click to browse
              </p>

              <input
                type="file"
                multiple
                accept="image/*,video/*,.pdf"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="elegant-button cursor-pointer"
              >
                Choose Files
              </label>

              <div className="mt-4 text-center text-sm text-slate-500">
                Supported: JPG, PNG, WebP, HEIC, PDF, MP4, AVI, MOV, WebM, MKV •
                Max: 500MB per file
              </div>
            </div>

            {files.length > 0 && (
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-200">
                    Files ({files.length})
                  </h3>
                  <div className="flex items-center space-x-2">
                    {files.some((f) => f.status === "completed") && (
                      <>
                        <button
                          onClick={downloadAllCompleted}
                          className="px-3 py-1 text-sm text-blue-400 border border-blue-400/50 rounded hover:bg-blue-400/10 transition-colors"
                        >
                          Download All
                        </button>
                        <button
                          onClick={clearCompletedFiles}
                          className="px-3 py-1 text-sm text-green-400 border border-green-400/50 rounded hover:bg-green-400/10 transition-colors"
                        >
                          Clear Completed
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => setFiles([])}
                      className="px-3 py-1 text-sm text-red-400 border border-red-400/50 rounded hover:bg-red-400/10 transition-colors"
                    >
                      Clear All
                    </button>
                  </div>
                </div>

                {files.some((f) => f.status === "pending") && (
                  <div className="flex items-center space-x-3 mb-4 p-3 bg-slate-700/30 rounded-lg">
                    <input
                      type="checkbox"
                      id="select-all"
                      checked={files
                        .filter((f) => f.status === "pending")
                        .every((f) => f.selected)}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 text-blue-500 bg-slate-600 border-slate-500 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <label
                      htmlFor="select-all"
                      className="text-sm text-slate-300 cursor-pointer"
                    >
                      Select all pending files
                    </label>
                  </div>
                )}
                <div className="space-y-3">
                  {files.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center p-3 bg-slate-700/50 rounded-lg"
                    >
                      {/* Checkbox for pending files */}
                      {file.status === "pending" && (
                        <div className="mr-3">
                          <input
                            type="checkbox"
                            id={`file-${file.id}`}
                            checked={file.selected || false}
                            onChange={() => toggleFileSelection(file.id)}
                            className="w-4 h-4 text-blue-500 bg-slate-600 border-slate-500 rounded focus:ring-blue-500 focus:ring-2"
                            title={`Select file ${file.originalFile.name}`}
                            placeholder="Select file"
                          />
                        </div>
                      )}

                      {/* File info section */}
                      <div className="flex items-center space-x-3 flex-1">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
                          {file.status === "processing" ? (
                            <svg
                              className="animate-spin w-5 h-5 text-blue-400"
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
                          ) : file.status === "completed" ? (
                            <svg
                              className="w-5 h-5 text-green-400"
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
                          ) : file.status === "error" ? (
                            <svg
                              className="w-5 h-5 text-red-400"
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
                          ) : (
                            <svg
                              className="w-5 h-5 text-blue-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-slate-200 font-medium">
                            {file.originalFile.name}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-slate-500">
                            <span>
                              Original:{" "}
                              {(file.originalSize / 1024 / 1024).toFixed(2)} MB
                            </span>
                            {file.compressedSize && (
                              <>
                                <span>•</span>
                                <span>
                                  Compressed:{" "}
                                  {(file.compressedSize / 1024 / 1024).toFixed(
                                    2
                                  )}{" "}
                                  MB
                                </span>
                                <span>•</span>
                                <span className="text-green-400">
                                  {file.compressionRatio?.toFixed(1)}% saved
                                </span>
                              </>
                            )}
                            {file.error && (
                              <span className="text-red-400">
                                • {file.error}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center space-x-2 ml-3">
                        <div className="text-sm text-slate-400 capitalize">
                          {file.status}
                        </div>
                        {file.status === "completed" && file.compressedFile && (
                          <button
                            onClick={() => downloadFile(file)}
                            className="px-3 py-1 bg-green-500/20 text-green-400 rounded hover:bg-green-500/30 transition-colors text-sm"
                          >
                            Download
                          </button>
                        )}
                        <button
                          onClick={() => removeFile(file.id)}
                          className="p-1 text-red-400 hover:bg-red-400/10 rounded transition-colors"
                          title="Remove file"
                        >
                          <svg
                            className="w-4 h-4"
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
                      </div>
                    </div>
                  ))}
                </div>

                {files.some((f) => f.status === "completed") && (
                  <div className="mt-4 p-3 bg-blue-500/10 border border-blue-400/30 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <svg
                        className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0"
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
                      <div className="text-sm text-blue-300">
                        <strong>Download Info:</strong> Files will be saved to
                        your browser's default download folder. Click individual
                        "Download" buttons to choose custom filenames, or use
                        "Download All" for batch download. All files are
                        prefixed with "HYPcompress_" to identify compressed
                        versions.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {files.length > 0 && (
              <>
                {/* Compression Level Selection */}
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                  <h3 className="text-lg font-semibold text-slate-200 mb-4">
                    Compression Level
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={() => setCompressionLevel("low")}
                      className={`flex-1 p-4 rounded-lg border transition-all duration-300 ${
                        compressionLevel === "low"
                          ? "bg-blue-500/20 border-blue-400 text-blue-300"
                          : "bg-slate-700/50 border-slate-600 text-slate-300 hover:border-slate-500"
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-lg font-semibold mb-1">Low</div>
                        <div className="text-sm opacity-75">
                          85% Quality • Faster
                        </div>
                      </div>
                    </button>
                    <button
                      onClick={() => setCompressionLevel("medium")}
                      className={`flex-1 p-4 rounded-lg border transition-all duration-300 ${
                        compressionLevel === "medium"
                          ? "bg-blue-500/20 border-blue-400 text-blue-300"
                          : "bg-slate-700/50 border-slate-600 text-slate-300 hover:border-slate-500"
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-lg font-semibold mb-1">Medium</div>
                        <div className="text-sm opacity-75">
                          70% Quality • Balanced
                        </div>
                      </div>
                    </button>
                    <button
                      onClick={() => setCompressionLevel("high")}
                      className={`flex-1 p-4 rounded-lg border transition-all duration-300 ${
                        compressionLevel === "high"
                          ? "bg-blue-500/20 border-blue-400 text-blue-300"
                          : "bg-slate-700/50 border-slate-600 text-slate-300 hover:border-slate-500"
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-lg font-semibold mb-1">High</div>
                        <div className="text-sm opacity-75">
                          50% Quality • Smallest
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Compress Button */}
                <div className="text-center">
                  {(() => {
                    const selectedFiles = files.filter(
                      (f) => f.selected && f.status === "pending"
                    );
                    const selectedCount = selectedFiles.length;

                    return (
                      <button
                        onClick={compressFiles}
                        disabled={isProcessing || selectedCount === 0}
                        className="elegant-button text-lg px-8 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isProcessing ? (
                          <div className="flex items-center">
                            <svg
                              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                              xmlns="http://www.w3.org/2000/svg"
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
                            Processing...
                          </div>
                        ) : selectedCount === 0 ? (
                          "Select files to compress"
                        ) : (
                          `Compress ${selectedCount} Selected File${
                            selectedCount !== 1 ? "s" : ""
                          }`
                        )}
                      </button>
                    );
                  })()}
                </div>

                <div className="text-center text-slate-400">
                  {(() => {
                    const selectedCount = files.filter(
                      (f) => f.selected && f.status === "pending"
                    ).length;
                    const pendingCount = files.filter(
                      (f) => f.status === "pending"
                    ).length;
                    const completedCount = files.filter(
                      (f) => f.status === "completed"
                    ).length;

                    if (selectedCount > 0) {
                      return `${selectedCount} of ${pendingCount} files selected for compression`;
                    } else if (pendingCount > 0) {
                      return `${pendingCount} files ready for compression`;
                    } else if (completedCount > 0) {
                      return `${completedCount} files compressed successfully`;
                    } else {
                      return "No files uploaded";
                    }
                  })()}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

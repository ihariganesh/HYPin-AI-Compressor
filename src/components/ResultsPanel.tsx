import {
  Download,
  Trash2,
  FileImage,
  FileText,
  Video,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
} from "lucide-react";
import type { ProcessedFile } from "../App";

interface ResultsPanelProps {
  files: ProcessedFile[];
  onCompress: (fileId: string) => void;
  onRemove: (fileId: string) => void;
  isProcessing: boolean;
}

const ResultsPanel = ({
  files,
  onCompress,
  onRemove,
  isProcessing,
}: ResultsPanelProps) => {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) return FileImage;
    if (fileType === "application/pdf") return FileText;
    if (fileType.startsWith("video/")) return Video;
    return FileImage;
  };

  const getStatusIcon = (status: ProcessedFile["status"]) => {
    switch (status) {
      case "completed":
        return CheckCircle;
      case "error":
        return XCircle;
      case "processing":
        return Loader2;
      default:
        return Clock;
    }
  };

  const getStatusColor = (status: ProcessedFile["status"]) => {
    switch (status) {
      case "completed":
        return "text-green-400";
      case "error":
        return "text-red-400";
      case "processing":
        return "text-blue-400";
      default:
        return "text-slate-400";
    }
  };

  const downloadFile = (file: ProcessedFile) => {
    if (!file.compressedFile) return;

    const url = URL.createObjectURL(file.compressedFile);
    const a = document.createElement("a");
    a.href = url;
    a.download = `compressed_${file.originalFile.name}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="futuristic-card p-6">
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          <Download className="w-5 h-5 text-blue-400" />
          File Results
        </h2>

        <div className="space-y-4">
          {files.map((file) => {
            const FileIcon = getFileIcon(file.originalFile.type);
            const StatusIcon = getStatusIcon(file.status);

            return (
              <div
                key={file.id}
                className="futuristic-card p-4 border border-slate-700 hover:border-slate-600 transition-colors"
              >
                <div className="flex items-center gap-4">
                  {/* File Icon */}
                  <div className="w-10 h-10 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileIcon className="w-5 h-5 text-blue-400" />
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-white truncate mb-1">
                      {file.originalFile.name}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <span>Original: {formatFileSize(file.originalSize)}</span>
                      {file.compressedSize && (
                        <>
                          <span>•</span>
                          <span>
                            Compressed: {formatFileSize(file.compressedSize)}
                          </span>
                          <span>•</span>
                          <span className="text-green-400">
                            {file.compressionRatio?.toFixed(1)}% reduced
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex items-center gap-2">
                    <StatusIcon
                      className={`w-5 h-5 ${getStatusColor(file.status)} ${
                        file.status === "processing" ? "animate-spin" : ""
                      }`}
                    />
                    <span
                      className={`text-sm font-medium ${getStatusColor(
                        file.status
                      )}`}
                    >
                      {file.status === "pending" && "Pending"}
                      {file.status === "processing" && "Processing"}
                      {file.status === "completed" && "Complete"}
                      {file.status === "error" && "Failed"}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {file.status === "pending" && (
                      <button
                        onClick={() => onCompress(file.id)}
                        disabled={isProcessing}
                        className="elegant-button-sm"
                      >
                        Compress
                      </button>
                    )}

                    {file.status === "completed" && file.compressedFile && (
                      <button
                        onClick={() => downloadFile(file)}
                        className="elegant-button-sm"
                      >
                        Download
                      </button>
                    )}

                    <button
                      onClick={() => onRemove(file.id)}
                      disabled={isProcessing && file.status === "processing"}
                      className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                      aria-label="Remove file"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {file.status === "error" && file.error && (
                  <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <span className="text-sm text-red-400">{file.error}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {files.length === 0 && (
          <div className="text-center py-8 text-slate-400">
            No files uploaded yet
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsPanel;

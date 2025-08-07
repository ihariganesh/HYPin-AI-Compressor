import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileImage, FileText, Video } from "lucide-react";

interface FileUploadProps {
  onFileUpload: (files: File[]) => void;
}

const FileUpload = ({ onFileUpload }: FileUploadProps) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onFileUpload(acceptedFiles);
    },
    [onFileUpload]
  );

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
    accept: {
      "image/*": [
        ".jpeg",
        ".jpg",
        ".png",
        ".gif",
        ".bmp",
        ".webp",
        ".heic",
        ".heif",
      ],
      "application/pdf": [".pdf"],
      "video/*": [".mp4", ".avi", ".mov", ".wmv", ".flv", ".webm", ".mkv"],
    },
    multiple: true,
  });

  const getBorderColor = () => {
    if (isDragReject) return "border-red-400/50";
    if (isDragAccept) return "border-green-400/50";
    if (isDragActive) return "border-blue-400/50";
    return "border-slate-600";
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div
        {...getRootProps()}
        className={`upload-area ${getBorderColor()} cursor-pointer 
                   transition-all duration-300 hover:scale-[1.01] 
                   p-8 lg:p-12 text-center`}
      >
        <input {...getInputProps()} />

        <div className="mb-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-violet-500 rounded-2xl flex items-center justify-center shadow-lg">
            <Upload className="w-8 h-8 text-white" />
          </div>
        </div>

        <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">
          {isDragActive ? "Drop files here..." : "Upload Media Files"}
        </h3>

        <p className="text-slate-400 mb-8 lg:text-lg">
          Drag & drop your files or click to browse
        </p>

        <div className="grid grid-cols-3 gap-6 mb-8 max-w-md mx-auto">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center justify-center">
              <FileImage className="w-6 h-6 text-blue-400" />
            </div>
            <span className="text-sm text-slate-400">Images</span>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 bg-violet-500/10 border border-violet-500/20 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-violet-400" />
            </div>
            <span className="text-sm text-slate-400">PDFs</span>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 bg-purple-500/10 border border-purple-500/20 rounded-lg flex items-center justify-center">
              <Video className="w-6 h-6 text-purple-400" />
            </div>
            <span className="text-sm text-slate-400">Videos</span>
          </div>
        </div>

        <button className="elegant-button">Choose Files</button>
      </div>

      <div className="mt-4 text-center text-sm text-slate-500">
        Supported formats: JPG, PNG, WebP, HEIC, PDF, MP4, AVI, MOV, WebM, MKV •
        Max: 500MB per file
      </div>
    </div>
  );
};

export default FileUpload;

import { Zap, Shield, Minimize2 } from "lucide-react";

export type CompressionLevel = "low" | "medium" | "high";

interface CompressionPanelProps {
  compressionLevel: CompressionLevel;
  onCompressionLevelChange: (level: CompressionLevel) => void;
  onCompressAll: () => void;
  isProcessing: boolean;
  fileCount: number;
}

const CompressionPanel = ({
  compressionLevel,
  onCompressionLevelChange,
  onCompressAll,
  isProcessing,
  fileCount,
}: CompressionPanelProps) => {
  const levels = [
    {
      id: "low" as CompressionLevel,
      label: "Light",
      description: "Preserve quality",
      icon: Shield,
      quality: "85%",
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/30",
    },
    {
      id: "medium" as CompressionLevel,
      label: "Balanced",
      description: "Best ratio",
      icon: Zap,
      quality: "70%",
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/30",
    },
    {
      id: "high" as CompressionLevel,
      label: "Maximum",
      description: "Smallest size",
      icon: Minimize2,
      quality: "50%",
      color: "text-violet-400",
      bgColor: "bg-violet-500/10",
      borderColor: "border-violet-500/30",
    },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="futuristic-card p-6">
        <h3 className="text-xl font-semibold text-white mb-6 text-center">
          Compression Settings
        </h3>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {levels.map(
            ({
              id,
              label,
              description,
              icon: Icon,
              quality,
              color,
              bgColor,
              borderColor,
            }) => (
              <button
                key={id}
                onClick={() => !isProcessing && onCompressionLevelChange(id)}
                disabled={isProcessing}
                className={`
                futuristic-card p-4 text-center transition-all duration-300
                ${
                  compressionLevel === id
                    ? "ring-2 ring-blue-400/50 scale-105"
                    : "hover:scale-105"
                }
                ${
                  isProcessing
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }
              `}
              >
                <div
                  className={`w-12 h-12 mx-auto mb-3 ${bgColor} border ${borderColor} rounded-xl flex items-center justify-center`}
                >
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>

                <h4 className="font-semibold text-white mb-1">{label}</h4>
                <p className="text-sm text-slate-400 mb-2">{description}</p>
                <span className={`text-xs font-medium ${color}`}>
                  {quality} quality
                </span>
              </button>
            )
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-400">
            {fileCount} file{fileCount !== 1 ? "s" : ""} ready
          </div>

          <button
            onClick={onCompressAll}
            disabled={isProcessing || fileCount === 0}
            className={`elegant-button ${
              isProcessing || fileCount === 0
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing...
              </div>
            ) : (
              "Compress All Files"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompressionPanel;

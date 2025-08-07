import { Loader2 } from "lucide-react";

interface StatusIndicatorProps {
  filesProcessing: number;
}

const StatusIndicator = ({ filesProcessing }: StatusIndicatorProps) => {
  if (filesProcessing === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="futuristic-card p-3 flex items-center gap-2 border border-blue-400/30">
        <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
        <span className="text-sm text-white">
          Processing {filesProcessing} file{filesProcessing > 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
};

export default StatusIndicator;

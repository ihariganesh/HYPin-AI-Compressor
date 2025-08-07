import { Loader2, Cpu, Clock } from "lucide-react";

const ProgressDisplay = () => {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="futuristic-card p-6 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-violet-500 rounded-2xl flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
        </div>

        <h3 className="text-xl font-semibold text-white mb-3">
          Processing Files
        </h3>

        <p className="text-slate-400 mb-6">
          Compressing your files with optimal settings...
        </p>

        <div className="grid grid-cols-2 gap-6">
          <div className="text-center">
            <div className="w-10 h-10 mx-auto mb-2 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center justify-center">
              <Cpu className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-sm text-slate-400">Optimizing</span>
          </div>

          <div className="text-center">
            <div className="w-10 h-10 mx-auto mb-2 bg-violet-500/10 border border-violet-500/20 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-violet-400" />
            </div>
            <span className="text-sm text-slate-400">Please wait</span>
          </div>
        </div>

        <div className="mt-6">
          <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-400 to-violet-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressDisplay;

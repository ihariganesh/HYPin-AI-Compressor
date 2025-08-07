function App() {
  return (
    <div className="min-h-screen bg-slate-900">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-grid"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold gradient-text mb-8">CompressAI</h1>
          <p className="text-xl text-slate-400">Media Compression Web App</p>
          <div className="mt-8">
            <div className="futuristic-card p-8 max-w-md mx-auto">
              <h2 className="text-xl font-semibold text-white mb-4">
                App is Working!
              </h2>
              <p className="text-slate-400">
                The basic structure is now displaying correctly.
              </p>
              <button className="elegant-button mt-4">Test Button</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

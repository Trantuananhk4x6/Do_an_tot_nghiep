import React from "react";

const stepsData = [
  {
    id: 1,
    title: "Before Interview",
    items: ["Quiz", "Mock Interview", "Prepare Hub"],
  },
  {
    id: 2,
    title: "During Interview",
    items: ["🚀 AI Interview", "Real-Time Transcription", "Knowledge Support"],
  },
  {
    id: 3,
    title: "After Interview",
    items: ["Interview Summary", "Interview Analytics"],
  },
];

const Step = () => {
  return (
    <div className="mt-16 pt-8 pb-16 max-w-screen-xl mx-auto px-4">
      {/* Step Navigation */}
      <div className="mx-auto max-w-screen-xl text-center mb-12">
        <h2 className="sr-only">Steps</h2>
        <div className="relative after:absolute after:inset-x-0 after:top-1/2 after:block after:h-0.5 after:-translate-y-1/2 after:rounded-lg after:bg-gradient-to-r after:from-purple-600/50 after:via-pink-600/50 after:to-purple-600/50">
          <ol className="relative z-10 flex justify-between text-sm font-medium">
            {stepsData.map((step) => (
              <li key={step.id} className="flex flex-col">
                <div className="flex items-center gap-2 glass-effect px-4 py-2 rounded-xl border border-white/10">
                  <span
                    className={`size-8 rounded-full text-center text-xs font-bold flex items-center justify-center transition-all duration-300 ${
                      step.id === 2 
                        ? "bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-neon" 
                        : "glass-effect border border-white/10 text-gray-400"
                    }`}
                  >
                    {step.id}
                  </span>
                  <h1 className="hidden sm:block text-gray-300 font-semibold">{step.title}</h1>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Steps Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stepsData.map((step) => (
          <div key={step.id} className="glass-effect p-6 rounded-2xl border border-white/10 hover:border-purple-500/30 transition-all duration-300">
            <div className="space-y-3">
              {step.items.map((item, index) => (
                <button
                  key={index}
                  className="w-full py-3 px-4 glass-effect rounded-xl border border-white/10 text-gray-300 font-medium hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-pink-600/20 hover:border-purple-500/50 hover:shadow-neon transition-all duration-300"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Step;

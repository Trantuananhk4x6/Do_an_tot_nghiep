import React from "react";

const stepsData = [
  {
    id: 1,
    title: "Before Interview",
    items: [
      { name: "📝 Quiz", desc: "Test your technical knowledge" },
      { name: "🎭 Mock Interview", desc: "Practice with AI interviewer" },
      { name: "📚 Prepare Hub", desc: "Generate personalized questions" }
    ],
  },
  {
    id: 2,
    title: "During Interview",
    items: [
      { name: "🚀 Live Interview", desc: "Real-time AI assistance" },
      { name: "🎤 Transcription", desc: "Accurate speech-to-text" },
      { name: "💡 Knowledge Support", desc: "Instant answer suggestions" }
    ],
  },
  {
    id: 3,
    title: "After Interview",
    items: [
      { name: "📊 Summary", desc: "Detailed performance review" },
      { name: "📈 Analytics", desc: "Track your progress" },
      { name: "🎯 Insights", desc: "Get improvement tips" }
    ],
  },
];

const Step = () => {
  return (
    <div className="mt-16 pt-8 pb-16 max-w-screen-xl mx-auto px-4 relative">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-20 left-1/4 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl pointer-events-none"></div>
      
      {/* Step Navigation */}
      <div className="mx-auto max-w-screen-xl text-center mb-12 relative">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Your Journey to Success
          </span>
        </h2>
        <p className="text-gray-400 mb-8">Three simple steps to master your interview skills</p>
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        {stepsData.map((step, stepIndex) => (
          <div 
            key={step.id} 
            className="glass-effect p-6 rounded-2xl border border-white/10 hover:border-purple-500/30 transition-all duration-300 hover:scale-105 hover:shadow-neon relative group"
          >
            {/* Card number badge */}
            <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-neon">
              {step.id}
            </div>
            
            {/* Decorative corner elements */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-purple-500/30 rounded-tl-2xl"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-pink-500/30 rounded-br-2xl"></div>
            
            {/* Step title */}
            <h3 className="text-xl font-bold mb-4 text-gray-200 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-300">
              {step.title}
            </h3>
            
            <div className="space-y-3">
              {step.items.map((item, index) => (
                <div
                  key={index}
                  className="w-full py-3 px-4 glass-effect rounded-xl border border-white/10 hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-pink-600/20 hover:border-purple-500/50 hover:shadow-neon transition-all duration-300 hover:translate-x-1"
                >
                  <div className="text-gray-200 font-semibold text-left">{item.name}</div>
                  <div className="text-gray-400 text-sm text-left mt-1">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Step;

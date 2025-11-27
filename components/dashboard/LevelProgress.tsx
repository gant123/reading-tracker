// components/dashboard/LevelProgress.tsx
import { Crown, Sparkles } from 'lucide-react';

interface LevelProgressProps {
  levelData: {
    level: number;
    title: string;
    currentXp: number;
    xpForNextLevel: number;
    progressPercentage: number;
    minutesToNextLevel: number;
  };
}

export function LevelProgress({ levelData }: LevelProgressProps) {
  return (
    <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden mb-8">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center shadow-lg transform rotate-3">
                <span className="text-2xl font-black text-yellow-900">{levelData.level}</span>
              </div>
              <div className="absolute -top-2 -right-2">
                <Crown className="w-6 h-6 text-yellow-300 fill-yellow-300" />
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold">{levelData.title}</h2>
              <p className="text-indigo-200 text-sm flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                {levelData.currentXp} Lifetime Minutes Read
              </p>
            </div>
          </div>
          
          <div className="text-right hidden sm:block">
            <div className="text-sm text-indigo-200">Next Level</div>
            <div className="font-bold text-lg">{levelData.minutesToNextLevel} mins to go</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-indigo-200 mb-1">
            <span>Progress to Level {levelData.level + 1}</span>
            <span>{Math.round(levelData.progressPercentage)}%</span>
          </div>
          <div className="h-4 bg-black/20 rounded-full overflow-hidden backdrop-blur-sm border border-white/10">
            <div 
              className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(251,191,36,0.5)]"
              style={{ width: `${levelData.progressPercentage}%` }}
            >
              <div className="w-full h-full bg-[url('/noise.png')] opacity-20"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
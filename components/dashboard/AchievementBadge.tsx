import { Card, CardContent } from '@/components/ui/card';

interface AchievementBadgeProps {
  achievement: {
    id: string;
    name: string;
    description: string;
    icon: string;
  };
  earned?: boolean;
  earnedAt?: Date;
}

export function AchievementBadge({ achievement, earned = false, earnedAt }: AchievementBadgeProps) {
  return (
    <Card className={earned ? 'bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200' : 'opacity-50 grayscale'}>
      <CardContent className="p-4">
        <div className="flex flex-col items-center text-center">
          <span className="text-4xl mb-2">{achievement.icon}</span>
          <h3 className="font-semibold text-sm mb-1">{achievement.name}</h3>
          <p className="text-xs text-gray-600 mb-2">{achievement.description}</p>
          {earned && earnedAt && (
            <span className="text-xs text-amber-700 font-medium">
              Earned {new Date(earnedAt).toLocaleDateString()}
            </span>
          )}
          {!earned && (
            <span className="text-xs text-gray-500">
              Not yet earned
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
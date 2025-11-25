import { Star, Lock } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface RewardCardProps {
  reward: {
    id: string;
    title: string;
    description: string;
    pointsCost: number;
    icon: string;
  };
  userPoints: number;
  onRedeem?: () => void;
}

export function RewardCard({ reward, userPoints, onRedeem }: RewardCardProps) {
  const canAfford = userPoints >= reward.pointsCost;

  return (
    <Card className={!canAfford ? 'opacity-75' : ''}>
      <CardHeader>
        <div className="text-5xl text-center mb-2">{reward.icon}</div>
        <CardTitle className="text-center">{reward.title}</CardTitle>
      </CardHeader>
      
      <CardContent>
        <p className="text-gray-600 text-sm text-center mb-4">
          {reward.description}
        </p>
        
        <div className="flex items-center justify-center gap-2 bg-amber-50 rounded-lg py-3">
          <Star className="w-5 h-5 text-amber-500" />
          <span className="text-2xl font-bold text-gray-900">
            {reward.pointsCost}
          </span>
          <span className="text-gray-600">points</span>
        </div>
      </CardContent>
      
      <CardFooter>
        {canAfford ? (
          <Button
            onClick={onRedeem}
            className="w-full"
          >
            Redeem Reward
          </Button>
        ) : (
          <Button
            disabled
            variant="secondary"
            className="w-full"
          >
            <Lock className="w-4 h-4 mr-2" />
            Need {reward.pointsCost - userPoints} more points
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
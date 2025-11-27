'use client';

import { useState } from 'react';
import { Gift, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { showToast } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export function MysteryBox({ userPoints, onPurchase }: { userPoints: number; onPurchase: () => void }) {
  const [loading, setLoading] = useState(false);
  const [wonItem, setWonItem] = useState<any>(null);

  const handleOpen = async () => {
    if (userPoints < 100) return;
    setLoading(true);

    try {
      const res = await fetch('/api/avatar/mystery-box', { method: 'POST' });
      const data = await res.json();

      if (res.ok) {
        setWonItem(data.item);
        onPurchase();
        showToast.success('Mystery Box Opened!');
      } else {
        showToast.error(data.error);
      }
    } catch (e) {
      showToast.error("Failed to open box");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card className="p-6 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white border-none relative overflow-hidden group">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay"></div>
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="mb-4 p-4 bg-white/20 rounded-full animate-bounce">
            <Gift className="w-12 h-12 text-white" />
          </div>
          <h3 className="text-2xl font-bold mb-2">Mystery Box</h3>
          <p className="text-indigo-100 mb-6">Win a random Style or Background!</p>
          
          <Button 
            onClick={handleOpen} 
            disabled={loading || userPoints < 100}
            className="w-full bg-white text-purple-600 hover:bg-white/90 font-bold shadow-lg"
          >
            {loading ? 'Opening...' : 'Open for 100 Points'}
          </Button>
        </div>
      </Card>

      <Dialog open={!!wonItem} onOpenChange={(open) => !open && setWonItem(null)}>
        <DialogContent className="sm:max-w-md text-center">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl flex items-center justify-center gap-2">
              <Sparkles className="text-yellow-500" /> You Won!
            </DialogTitle>
          </DialogHeader>
          <div className="py-8">
            <div className="text-6xl mb-4">{wonItem?.type === 'style' ? '🎭' : '🎨'}</div>
            <h2 className="text-xl font-bold text-purple-600 mb-2">{wonItem?.name}</h2>
            <p className="text-gray-500">Rarity: {wonItem?.rarity}</p>
          </div>
          <Button onClick={() => setWonItem(null)} className="w-full">Awesome!</Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
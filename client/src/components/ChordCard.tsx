import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Play, X, RotateCw } from 'lucide-react';
import type { Chord } from '@shared/schema';

interface ChordCardProps {
  chord: Chord;
  isPlaying?: boolean;
  onPlay?: () => void;
  onRemove?: () => void;
  onInversionChange?: (newInversion: 0 | 1 | 2 | 3) => void;
  className?: string;
}

export default function ChordCard({ 
  chord, 
  isPlaying = false, 
  onPlay, 
  onRemove,
  onInversionChange,
  className 
}: ChordCardProps) {
  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'major':
        return 'bg-primary/20 text-primary border-primary/30';
      case 'minor':
        return 'bg-accent/20 text-accent border-accent/30';
      case 'diminished':
        return 'bg-destructive/20 text-destructive border-destructive/30';
      case 'augmented':
        return 'bg-chart-3/20 text-chart-3 border-chart-3/30';
      default:
        return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  return (
    <Card className={cn(
      'relative p-4 min-w-[160px] transition-all duration-200',
      'hover-elevate active-elevate-2',
      isPlaying && 'ring-2 ring-primary shadow-lg shadow-primary/20',
      className
    )}>
      {onRemove && (
        <Button
          size="icon"
          variant="ghost"
          onClick={onRemove}
          data-testid={`button-remove-chord-${chord.symbol}`}
          className="absolute top-2 right-2 h-6 w-6 opacity-60 hover:opacity-100"
        >
          <X className="h-3 w-3" />
        </Button>
      )}
      
      <div className="space-y-3">
        {/* Roman Numeral */}
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground mb-1">
            {chord.romanNumeral}
          </div>
        </div>

        {/* Chord Symbol */}
        <div className="text-center">
          <div className="text-lg font-semibold text-foreground mb-2">
            {chord.symbol}
          </div>
          
          {/* Quality Badge */}
          <Badge 
            variant="outline" 
            className={cn('text-xs', getQualityColor(chord.quality))}
          >
            {chord.quality}
          </Badge>
        </div>

        {/* Chord Notes */}
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground text-center">
            Notes
          </div>
          <div className="flex flex-wrap gap-1 justify-center">
            {chord.notes.map((note, index) => (
              <Badge
                key={`${note.name}-${index}`}
                variant="secondary"
                className="text-xs px-2 py-0.5"
              >
                {note.name}
              </Badge>
            ))}
          </div>
        </div>

        {/* Inversion Controls */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
              {chord.inversion === 0 && 'Root position'}
              {chord.inversion === 1 && '1st inversion'}
              {chord.inversion === 2 && '2nd inversion'}
              {chord.inversion === 3 && '3rd inversion'}
            </div>
            {onInversionChange && (
              <Button
                size="icon"
                variant="ghost"
                onClick={() => {
                  const nextInversion = ((chord.inversion + 1) % 4) as 0 | 1 | 2 | 3;
                  console.log(`Changing inversion from ${chord.inversion} to ${nextInversion}`);
                  onInversionChange(nextInversion);
                }}
                data-testid={`button-invert-${chord.symbol}`}
                className="h-6 w-6 opacity-60 hover:opacity-100"
              >
                <RotateCw className="h-3 w-3" />
              </Button>
            )}
          </div>
          
          {/* Bass note indicator for inversions */}
          {chord.inversion > 0 && (
            <div className="text-xs text-center">
              <Badge variant="outline" className="text-xs px-1 py-0.5">
                Bass: {chord.notes[0].name}
              </Badge>
            </div>
          )}
        </div>

        {/* Play Button */}
        {onPlay && (
          <Button
            size="sm"
            variant={isPlaying ? "default" : "outline"}
            onClick={onPlay}
            data-testid={`button-play-chord-${chord.symbol}`}
            className="w-full"
            disabled={isPlaying}
          >
            <Play className="h-3 w-3 mr-1" />
            {isPlaying ? 'Playing...' : 'Play'}
          </Button>
        )}
      </div>
    </Card>
  );
}
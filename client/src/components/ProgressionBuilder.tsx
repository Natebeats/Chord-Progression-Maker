import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Play, Plus, Shuffle, Download } from 'lucide-react';
import ChordCard from './ChordCard';
import type { Chord } from '@shared/schema';

interface ProgressionBuilderProps {
  chords: Chord[];
  isPlaying?: boolean;
  currentChordIndex?: number;
  onChordsChange?: (chords: Chord[]) => void;
  onPlay?: () => void;
  onAddChord?: () => void;
  onShuffle?: () => void;
  onExportMidi?: () => void;
  onInversionChange?: (chordIndex: number, newInversion: 0 | 1 | 2 | 3) => void;
  className?: string;
}

export default function ProgressionBuilder({
  chords = [],
  isPlaying = false,
  currentChordIndex = -1,
  onChordsChange,
  onPlay,
  onAddChord,
  onShuffle,
  onExportMidi,
  onInversionChange,
  className
}: ProgressionBuilderProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleRemoveChord = (index: number) => {
    console.log(`Removing chord at index ${index}`);
    const newChords = chords.filter((_, i) => i !== index);
    onChordsChange?.(newChords);
  };

  const handlePlayChord = (index: number) => {
    console.log(`Playing chord at index ${index}`);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null) return;

    console.log(`Moving chord from ${draggedIndex} to ${dropIndex}`);
    const newChords = [...chords];
    const draggedChord = newChords[draggedIndex];
    newChords.splice(draggedIndex, 1);
    newChords.splice(dropIndex, 0, draggedChord);
    
    onChordsChange?.(newChords);
    setDraggedIndex(null);
  };

  return (
    <Card className={cn('p-6', className)}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Chord Progression</h3>
            <p className="text-sm text-muted-foreground">
              {chords.length} chord{chords.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={onShuffle}
              data-testid="button-shuffle-progression"
              disabled={chords.length < 2}
            >
              <Shuffle className="h-4 w-4" />
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={onAddChord}
              data-testid="button-add-chord"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Chord Slots */}
        <div className="space-y-4">
          {chords.length === 0 ? (
            <div className="border-2 border-dashed border-muted-foreground/20 rounded-lg p-8 text-center">
              <div className="text-muted-foreground mb-4">
                <Plus className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No chords yet</p>
                <p className="text-sm">Add chords to build your progression</p>
              </div>
              <Button onClick={onAddChord} data-testid="button-add-first-chord">
                Add First Chord
              </Button>
            </div>
          ) : (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {chords.map((chord, index) => (
                <div
                  key={`chord-${index}-${chord.symbol}`}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  className={cn(
                    'relative flex-shrink-0',
                    draggedIndex === index && 'opacity-50'
                  )}
                >
                  {/* Position indicator */}
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                    <Badge variant="secondary" className="text-xs">
                      {index + 1}
                    </Badge>
                    {currentChordIndex === index && (
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-primary rounded-full animate-pulse" />
                    )}
                  </div>
                  
                  <ChordCard
                    chord={chord}
                    isPlaying={currentChordIndex === index && isPlaying}
                    onPlay={() => handlePlayChord(index)}
                    onRemove={() => handleRemoveChord(index)}
                    onInversionChange={(newInversion) => onInversionChange?.(index, newInversion)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Controls */}
        {chords.length > 0 && (
          <div className="flex gap-3 pt-4 border-t">
            <Button
              onClick={onPlay}
              data-testid="button-play-progression"
              disabled={isPlaying}
              className="flex-1"
            >
              <Play className="h-4 w-4 mr-2" />
              {isPlaying ? 'Playing...' : 'Play Progression'}
            </Button>
            
            <Button
              variant="outline"
              onClick={onExportMidi}
              data-testid="button-export-midi"
              disabled={isPlaying}
            >
              <Download className="h-4 w-4 mr-2" />
              Export MIDI
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
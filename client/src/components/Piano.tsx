import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { Chord } from '@shared/schema';

interface PianoProps {
  highlightedChord?: Chord | null;
  onKeyPress?: (note: string) => void;
  className?: string;
}

// Piano key data
const WHITE_KEYS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const BLACK_KEYS = ['C#', 'D#', '', 'F#', 'G#', 'A#', '']; // Empty strings for positioning

export default function Piano({ highlightedChord, onKeyPress, className }: PianoProps) {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());

  const handleKeyPress = (note: string) => {
    console.log(`Piano key pressed: ${note}`);
    onKeyPress?.(note);
    
    // Visual feedback
    setPressedKeys(prev => new Set(prev).add(note));
    setTimeout(() => {
      setPressedKeys(prev => {
        const newSet = new Set(prev);
        newSet.delete(note);
        return newSet;
      });
    }, 200);
  };

  const getHighlightedNotes = () => {
    if (!highlightedChord) return new Set<string>();
    return new Set(highlightedChord.notes.map(note => note.name));
  };

  const highlightedNotes = getHighlightedNotes();

  return (
    <div className={cn('flex items-end justify-center bg-card rounded-lg p-4', className)}>
      <div className="relative flex">
        {/* White Keys */}
        {WHITE_KEYS.map((note, index) => (
          <button
            key={`white-${note}`}
            onClick={() => handleKeyPress(note)}
            data-testid={`piano-key-${note}`}
            className={cn(
              'relative w-12 h-32 bg-white border border-border rounded-b-md mr-0.5 last:mr-0',
              'hover-elevate active-elevate-2 transition-all duration-75',
              'flex items-end justify-center pb-2 text-xs font-medium text-muted-foreground',
              pressedKeys.has(note) && 'bg-accent/20',
              highlightedNotes.has(note) && 'bg-primary/30 shadow-lg shadow-primary/20',
            )}
          >
            {note}
          </button>
        ))}
        
        {/* Black Keys */}
        <div className="absolute top-0 left-0 flex">
          {BLACK_KEYS.map((note, index) => {
            if (!note) {
              return <div key={`spacer-${index}`} className="w-12" />;
            }
            
            return (
              <button
                key={`black-${note}`}
                onClick={() => handleKeyPress(note)}
                data-testid={`piano-key-${note}`}
                className={cn(
                  'w-8 h-20 bg-foreground/90 rounded-b-md ml-8 -mr-4',
                  'hover-elevate active-elevate-2 transition-all duration-75',
                  'flex items-end justify-center pb-1 text-xs font-medium text-background',
                  pressedKeys.has(note) && 'bg-accent',
                  highlightedNotes.has(note) && 'bg-primary shadow-lg shadow-primary/40',
                )}
                style={{ zIndex: 10 }}
              >
                {note}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
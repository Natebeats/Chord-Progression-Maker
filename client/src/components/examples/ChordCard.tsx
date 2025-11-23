import ChordCard from '../ChordCard';
import { MusicTheory } from '@/lib/musicTheory';

export default function ChordCardExample() {
  // Create sample chords for demonstration
  const majorChord = {
    ...MusicTheory.buildChord('C', 'major'),
    romanNumeral: 'I'
  };
  
  const minorChord = {
    ...MusicTheory.buildChord('A', 'minor', 'm7'),
    romanNumeral: 'vi7'
  };

  const handlePlay = (chordName: string) => {
    console.log(`Playing chord: ${chordName}`);
  };

  const handleRemove = (chordName: string) => {
    console.log(`Removing chord: ${chordName}`);
  };

  const handleInversionChange = (chordName: string, newInversion: 0 | 1 | 2 | 3) => {
    console.log(`Changing ${chordName} to inversion ${newInversion}`);
  };

  return (
    <div className="flex gap-4 p-4">
      <ChordCard 
        chord={majorChord}
        onPlay={() => handlePlay('C major')}
        onRemove={() => handleRemove('C major')}
        onInversionChange={(inv) => handleInversionChange('C major', inv)}
      />
      <ChordCard 
        chord={minorChord}
        isPlaying={true}
        onPlay={() => handlePlay('A minor 7')}
        onRemove={() => handleRemove('A minor 7')}
        onInversionChange={(inv) => handleInversionChange('A minor 7', inv)}
      />
    </div>
  );
}
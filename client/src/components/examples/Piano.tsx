import Piano from '../Piano';
import { MusicTheory } from '@/lib/musicTheory';

export default function PianoExample() {
  // Create a sample chord for demonstration
  const sampleChord = {
    ...MusicTheory.buildChord('C', 'major'),
    romanNumeral: 'I'
  };

  const handleKeyPress = (note: string) => {
    console.log(`Piano demo: ${note} pressed`);
  };

  return (
    <Piano 
      highlightedChord={sampleChord}
      onKeyPress={handleKeyPress}
    />
  );
}
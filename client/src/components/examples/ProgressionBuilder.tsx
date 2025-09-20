import ProgressionBuilder from '../ProgressionBuilder';
import { MusicTheory } from '@/lib/musicTheory';

export default function ProgressionBuilderExample() {
  // Create sample progression for demonstration
  const sampleChords = [
    { ...MusicTheory.buildChord('C', 'major'), romanNumeral: 'I' },
    { ...MusicTheory.buildChord('A', 'minor'), romanNumeral: 'vi' },
    { ...MusicTheory.buildChord('F', 'major'), romanNumeral: 'IV' },
    { ...MusicTheory.buildChord('G', 'major'), romanNumeral: 'V' }
  ];

  const handleChordsChange = (chords: any[]) => {
    console.log('Chords changed:', chords.map(c => c.symbol));
  };

  const handlePlay = () => {
    console.log('Playing progression');
  };

  const handleAddChord = () => {
    console.log('Adding new chord');
  };

  const handleShuffle = () => {
    console.log('Shuffling progression');
  };

  const handleExportMidi = () => {
    console.log('Exporting to MIDI');
  };

  const handleInversionChange = (chordIndex: number, newInversion: 0 | 1 | 2 | 3) => {
    console.log(`Changing chord ${chordIndex} to inversion ${newInversion}`);
  };

  return (
    <ProgressionBuilder
      chords={sampleChords}
      currentChordIndex={1}
      onChordsChange={handleChordsChange}
      onPlay={handlePlay}
      onAddChord={handleAddChord}
      onShuffle={handleShuffle}
      onExportMidi={handleExportMidi}
      onInversionChange={handleInversionChange}
    />
  );
}
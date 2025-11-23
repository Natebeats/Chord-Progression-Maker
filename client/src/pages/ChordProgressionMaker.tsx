import { useState, useEffect, useCallback } from 'react';
import { MusicTheory } from '@/lib/musicTheory';
import { AudioEngine } from '@/lib/audioEngine';
import Piano from '@/components/Piano';
import ChordCard from '@/components/ChordCard';
import ProgressionBuilder from '@/components/ProgressionBuilder';
import KeySelector from '@/components/KeySelector';
import ControlPanel from '@/components/ControlPanel';
import ThemeToggle from '@/components/ThemeToggle';
import type { Chord, Scale, ProgressionStyle, RhythmPattern } from '@shared/schema';

export default function ChordProgressionMaker() {
  // State management
  const [currentKey, setCurrentKey] = useState('C');
  const [currentMode, setCurrentMode] = useState<'major' | 'minor'>('major');
  const [currentScale, setCurrentScale] = useState<Scale | null>(null);
  const [progression, setProgression] = useState<Chord[]>([]);
  const [selectedChord, setSelectedChord] = useState<Chord | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentChordIndex, setCurrentChordIndex] = useState(-1);
  
  // Control settings
  const [tempo, setTempo] = useState(120);
  const [style, setStyle] = useState<ProgressionStyle>('pop');
  const [rhythmPattern, setRhythmPattern] = useState<RhythmPattern>('block');
  const [progressionLength, setProgressionLength] = useState(4);
  
  // Audio engine
  const [audioEngine] = useState(() => new AudioEngine());

  // Generate scale when key or mode changes
  useEffect(() => {
    const scale = MusicTheory.generateScale(currentKey, currentMode);
    setCurrentScale(scale);
    console.log(`Generated ${currentKey} ${currentMode} scale:`, scale);
  }, [currentKey, currentMode]);

  // Generate preset progression
  const generateProgression = useCallback(() => {
    if (!currentScale) return;
    
    console.log(`Generating ${style} progression with ${progressionLength} chords`);
    const newProgression = MusicTheory.generateProgressionPreset(
      currentScale, 
      style, 
      progressionLength
    );
    setProgression(newProgression);
    setSelectedChord(newProgression[0] || null);
  }, [currentScale, style, progressionLength]);

  // Add random chord from current scale
  const addRandomChord = useCallback(() => {
    if (!currentScale) return;
    
    const randomChord = currentScale.chords[Math.floor(Math.random() * currentScale.chords.length)];
    console.log(`Adding chord: ${randomChord.symbol}`);
    setProgression(prev => [...prev, randomChord]);
  }, [currentScale]);

  // Shuffle current progression
  const shuffleProgression = useCallback(() => {
    if (progression.length < 2) return;
    
    console.log('Shuffling progression');
    const shuffled = [...progression].sort(() => Math.random() - 0.5);
    setProgression(shuffled);
  }, [progression]);

  // Play entire progression
  const playProgression = useCallback(async () => {
    if (progression.length === 0) return;
    
    console.log(`Playing progression with ${rhythmPattern} pattern at ${tempo} BPM`);
    setIsPlaying(true);
    
    try {
      // Visual feedback for progression playback
      let index = 0;
      const interval = setInterval(() => {
        setCurrentChordIndex(index);
        setSelectedChord(progression[index]);
        index++;
        
        if (index >= progression.length) {
          clearInterval(interval);
          setCurrentChordIndex(-1);
          setIsPlaying(false);
        }
      }, (60 / tempo) * 2 * 1000); // 2 beats per chord
      
      await audioEngine.playProgression(progression, tempo, rhythmPattern);
    } catch (error) {
      console.error('Error playing progression:', error);
      setIsPlaying(false);
      setCurrentChordIndex(-1);
    }
  }, [progression, tempo, rhythmPattern, audioEngine]);

  // Play single chord
  const playChord = useCallback(async (chord: Chord) => {
    console.log(`Playing chord: ${chord.symbol}`);
    setSelectedChord(chord);
    
    try {
      await audioEngine.playChord(chord, '2n');
    } catch (error) {
      console.error('Error playing chord:', error);
    }
  }, [audioEngine]);

  // Piano key press handler
  const handlePianoKeyPress = useCallback((note: string) => {
    // Find chord containing this note
    if (currentScale) {
      const chordWithNote = currentScale.chords.find(chord => 
        chord.notes.some(chordNote => chordNote.name === note)
      );
      if (chordWithNote) {
        playChord(chordWithNote);
      }
    }
  }, [currentScale, playChord]);

  // Handle inversion changes for progression chords
  const handleProgressionInversionChange = useCallback((chordIndex: number, newInversion: 0 | 1 | 2 | 3) => {
    console.log(`Changing progression chord ${chordIndex} to inversion ${newInversion}`);
    
    setProgression(prevProgression => {
      const newProgression = [...prevProgression];
      const oldChord = newProgression[chordIndex];
      
      // Create new chord with different inversion using MusicTheory
      const newChord = MusicTheory.getChordWithInversion(oldChord, newInversion);
      newProgression[chordIndex] = newChord;
      
      return newProgression;
    });
  }, []);

  // Handle inversion change for scale chords
  const handleScaleChordInversionChange = useCallback((chord: Chord, newInversion: 0 | 1 | 2 | 3) => {
    console.log(`Playing ${chord.symbol} with inversion ${newInversion}`);
    
    const invertedChord = MusicTheory.getChordWithInversion(chord, newInversion);
    playChord(invertedChord);
  }, [playChord]);

  // Export to MIDI
  const exportToMIDI = useCallback(() => {
    if (progression.length === 0) return;
    
    console.log(`Exporting progression to MIDI with ${rhythmPattern} pattern`);
    const filename = `${currentKey}_${currentMode}_${style}_progression`;
    audioEngine.exportToMIDI(progression, tempo, rhythmPattern, filename);
  }, [progression, currentKey, currentMode, style, tempo, rhythmPattern, audioEngine]);

  // Save progression (mock implementation)
  const saveProgression = useCallback(() => {
    if (progression.length === 0) return;
    
    const progressionData = {
      name: `${currentKey} ${currentMode} ${style}`,
      key: `${currentKey} ${currentMode}`,
      chords: progression.map(chord => ({
        symbol: chord.symbol,
        root: chord.root,
        quality: chord.quality,
        extension: chord.extension,
        inversion: chord.inversion,
        romanNumeral: chord.romanNumeral
      })),
      tempo,
      style,
      rhythmPattern,
      createdAt: new Date().toISOString()
    };
    
    console.log('Saving progression:', progressionData);
    localStorage.setItem('savedProgression', JSON.stringify(progressionData));
    // TODO: Implement actual backend save functionality
  }, [progression, currentKey, currentMode, style, tempo, rhythmPattern]);

  // Load progression (mock implementation)
  const loadProgression = useCallback(() => {
    const saved = localStorage.getItem('savedProgression');
    if (!saved) {
      console.log('No saved progression found');
      return;
    }
    
    try {
      const progressionData = JSON.parse(saved);
      console.log('Loading progression:', progressionData);
      
      // TODO: Rebuild full chord objects from saved data
      // For now, just generate a sample progression
      generateProgression();
    } catch (error) {
      console.error('Error loading progression:', error);
    }
  }, [generateProgression]);

  // Initialize with default progression
  useEffect(() => {
    generateProgression();
  }, [generateProgression]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Chord Progression Maker
              </h1>
              <p className="text-sm text-muted-foreground">
                Create, play, and export beautiful chord progressions
              </p>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Control Panel - Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <KeySelector
              selectedKey={currentKey}
              selectedMode={currentMode}
              onKeyChange={setCurrentKey}
              onModeChange={setCurrentMode}
            />
            
            <ControlPanel
              tempo={tempo}
              style={style}
              rhythmPattern={rhythmPattern}
              progressionLength={progressionLength}
              onTempoChange={setTempo}
              onStyleChange={setStyle}
              onRhythmPatternChange={setRhythmPattern}
              onProgressionLengthChange={setProgressionLength}
              onGenerateProgression={generateProgression}
              onSaveProgression={saveProgression}
              onLoadProgression={loadProgression}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Piano */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Interactive Piano</h2>
              <Piano
                highlightedChord={selectedChord}
                onKeyPress={handlePianoKeyPress}
              />
              {selectedChord && (
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Currently showing: <span className="font-medium text-foreground">
                      {selectedChord.symbol} ({selectedChord.romanNumeral})
                    </span>
                  </p>
                </div>
              )}
            </div>

            {/* Progression Builder */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Your Progression</h2>
              <ProgressionBuilder
                chords={progression}
                isPlaying={isPlaying}
                currentChordIndex={currentChordIndex}
                onChordsChange={setProgression}
                onPlay={playProgression}
                onAddChord={addRandomChord}
                onShuffle={shuffleProgression}
                onExportMidi={exportToMIDI}
                onInversionChange={handleProgressionInversionChange}
              />
            </div>

            {/* Available Chords */}
            {currentScale && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">
                  Available Chords ({currentScale.key})
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                  {currentScale.chords.map((chord, index) => (
                    <ChordCard
                      key={`scale-chord-${index}`}
                      chord={chord}
                      onPlay={() => playChord(chord)}
                      onInversionChange={(newInversion) => handleScaleChordInversionChange(chord, newInversion)}
                      isPlaying={selectedChord?.symbol === chord.symbol && isPlaying}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
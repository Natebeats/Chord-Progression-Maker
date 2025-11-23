import type { Note, Chord, Scale, ProgressionStyle } from '@shared/schema';

// Note frequencies (A4 = 440Hz)
const NOTE_FREQUENCIES: Record<string, number> = {
  'C': 261.63,
  'C#': 277.18, 'Db': 277.18,
  'D': 293.66,
  'D#': 311.13, 'Eb': 311.13,
  'E': 329.63,
  'F': 349.23,
  'F#': 369.99, 'Gb': 369.99,
  'G': 392.00,
  'G#': 415.30, 'Ab': 415.30,
  'A': 440.00,
  'A#': 466.16, 'Bb': 466.16,
  'B': 493.88,
};

// Chromatic scale for calculations
const CHROMATIC = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Scale intervals
const MAJOR_INTERVALS = [0, 2, 4, 5, 7, 9, 11];
const MINOR_INTERVALS = [0, 2, 3, 5, 7, 8, 10];

// Roman numerals for scale degrees
const MAJOR_ROMANS = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'];
const MINOR_ROMANS = ['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII'];

export class MusicTheory {
  // Get note frequency for a specific octave
  static getNoteFrequency(noteName: string, octave: number = 4): number {
    const baseFreq = NOTE_FREQUENCIES[noteName];
    if (!baseFreq) throw new Error(`Unknown note: ${noteName}`);
    
    // Calculate frequency for the given octave (A4 = 440Hz is the reference)
    const octaveMultiplier = Math.pow(2, octave - 4);
    return baseFreq * octaveMultiplier;
  }

  // Create a note object
  static createNote(name: string, octave: number = 4): Note {
    return {
      name,
      octave,
      frequency: this.getNoteFrequency(name, octave)
    };
  }

  // Get scale notes
  static getScaleNotes(root: string, mode: 'major' | 'minor'): string[] {
    const rootIndex = CHROMATIC.indexOf(root);
    if (rootIndex === -1) throw new Error(`Unknown root: ${root}`);

    const intervals = mode === 'major' ? MAJOR_INTERVALS : MINOR_INTERVALS;
    return intervals.map(interval => CHROMATIC[(rootIndex + interval) % 12]);
  }

  // Build chord from root and quality
  static buildChord(
    root: string,
    quality: 'major' | 'minor' | 'diminished' | 'augmented' = 'major',
    extension?: '7' | 'maj7' | 'm7' | 'dim7' | 'hdim7',
    inversion: 0 | 1 | 2 | 3 = 0,
    octave: number = 4
  ): Omit<Chord, 'romanNumeral'> {
    const rootIndex = CHROMATIC.indexOf(root);
    if (rootIndex === -1) throw new Error(`Unknown root: ${root}`);

    // Define chord intervals
    let intervals: number[] = [];
    let symbol = root;

    switch (quality) {
      case 'major':
        intervals = [0, 4, 7];
        break;
      case 'minor':
        intervals = [0, 3, 7];
        symbol += 'm';
        break;
      case 'diminished':
        intervals = [0, 3, 6];
        symbol += 'dim';
        break;
      case 'augmented':
        intervals = [0, 4, 8];
        symbol += 'aug';
        break;
    }

    // Add extensions
    if (extension) {
      switch (extension) {
        case '7':
          intervals.push(10); // minor 7th
          symbol += '7';
          break;
        case 'maj7':
          intervals.push(11); // major 7th
          symbol += 'maj7';
          break;
        case 'm7':
          intervals.push(10); // minor 7th
          symbol += 'm7';
          break;
        case 'dim7':
          intervals.push(9); // diminished 7th
          symbol += 'dim7';
          break;
        case 'hdim7':
          intervals.push(10); // half-diminished 7th
          symbol += 'ø7';
          break;
      }
    }

    // Create notes
    let noteIndices = intervals.map(interval => (rootIndex + interval) % 12);
    
    // Apply inversion
    for (let i = 0; i < inversion; i++) {
      noteIndices.push(noteIndices.shift()!);
    }

    const notes: Note[] = noteIndices.map((noteIndex, i) => {
      const noteName = CHROMATIC[noteIndex];
      const noteOctave = octave + Math.floor((rootIndex + intervals[i < intervals.length ? i : 0]) / 12);
      return this.createNote(noteName, noteOctave);
    });

    return {
      symbol,
      root,
      quality,
      extension,
      inversion,
      notes
    };
  }

  // Generate scale with diatonic chords
  static generateScale(key: string, mode: 'major' | 'minor'): Scale {
    const scaleNotes = this.getScaleNotes(key, mode);
    const romans = mode === 'major' ? MAJOR_ROMANS : MINOR_ROMANS;
    
    const chords: Chord[] = [];
    
    scaleNotes.forEach((root, index) => {
      let quality: 'major' | 'minor' | 'diminished';
      let extension: '7' | undefined;
      
      if (mode === 'major') {
        switch (index) {
          case 0: case 3: case 4: // I, IV, V
            quality = 'major';
            break;
          case 1: case 2: case 5: // ii, iii, vi
            quality = 'minor';
            break;
          case 6: // vii°
            quality = 'diminished';
            break;
          default:
            quality = 'major';
        }
      } else {
        switch (index) {
          case 0: case 3: case 4: // i, iv, v (though v is often major in practice)
            quality = 'minor';
            break;
          case 2: case 5: case 6: // III, VI, VII
            quality = 'major';
            break;
          case 1: // ii°
            quality = 'diminished';
            break;
          default:
            quality = 'minor';
        }
      }
      
      const chord = this.buildChord(root, quality, extension);
      chords.push({
        ...chord,
        romanNumeral: romans[index]
      });
    });

    return {
      key: `${key} ${mode}`,
      mode,
      notes: scaleNotes,
      chords
    };
  }

  // Generate progression presets
  static generateProgressionPreset(
    scale: Scale,
    style: ProgressionStyle,
    length: number = 4
  ): Chord[] {
    const { chords } = scale;
    
    switch (style) {
      case 'pop':
        // I-V-vi-IV pattern
        return [chords[0], chords[4], chords[5], chords[3]].slice(0, length);
        
      case 'jazz':
        // ii-V-I-vi pattern
        return [chords[1], chords[4], chords[0], chords[5]].slice(0, length);
        
      case 'blues':
        // I-I-IV-I pattern (simplified)
        return [chords[0], chords[0], chords[3], chords[0]].slice(0, length);
        
      case 'lofi':
        // i-VII-VI-VII pattern (for minor) or vi-IV-I-V (for major)
        if (scale.mode === 'minor') {
          return [chords[0], chords[6], chords[5], chords[6]].slice(0, length);
        } else {
          return [chords[5], chords[3], chords[0], chords[4]].slice(0, length);
        }
        
      case 'random':
      default:
        // Random selection from diatonic chords
        const progression: Chord[] = [];
        for (let i = 0; i < length; i++) {
          const randomIndex = Math.floor(Math.random() * chords.length);
          progression.push(chords[randomIndex]);
        }
        return progression;
    }
  }

  // Create chord with specific inversion
  static getChordWithInversion(
    chord: Chord,
    inversion: 0 | 1 | 2 | 3
  ): Chord {
    // Rebuild the chord with the new inversion
    const newChord = this.buildChord(
      chord.root,
      chord.quality,
      chord.extension,
      inversion
    );
    
    return {
      ...newChord,
      romanNumeral: chord.romanNumeral
    };
  }

  // Get all inversions of a chord
  static getAllInversions(chord: Chord): Chord[] {
    const inversions: Chord[] = [];
    
    for (let inv = 0; inv < 4; inv++) {
      const inversion = inv as 0 | 1 | 2 | 3;
      inversions.push(this.getChordWithInversion(chord, inversion));
    }
    
    return inversions;
  }

  // Apply voice leading optimization
  static optimizeVoiceLeading(chords: Chord[]): Chord[] {
    // This is a simplified voice leading optimization
    // In a full implementation, this would minimize voice movement between chords
    return chords.map(chord => ({ ...chord })); // Return copy for now
  }
}
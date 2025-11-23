import * as Tone from 'tone';
import MidiWriter from 'midi-writer-js';
import type { Chord, RhythmPattern } from '@shared/schema';

export class AudioEngine {
  private synth: Tone.PolySynth | null = null;
  private isPlaying: boolean = false;
  private currentSequence: Tone.Sequence | null = null;

  constructor() {
    this.initializeTone();
  }

  private async initializeTone() {
    // Initialize Tone.js
    if (Tone.context.state !== 'running') {
      await Tone.start();
    }

    // Create a polyphonic synthesizer
    this.synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: {
        type: 'triangle'
      },
      envelope: {
        attack: 0.02,
        decay: 0.1,
        sustain: 0.3,
        release: 1
      }
    }).toDestination();
  }

  // Play a single chord
  async playChord(chord: Chord, duration: string = '2n') {
    if (!this.synth) await this.initializeTone();
    
    const noteNames = chord.notes.map(note => `${note.name}${note.octave}`);
    this.synth?.triggerAttackRelease(noteNames, duration);
  }

  // Play chord progression
  async playProgression(
    chords: Chord[],
    tempo: number = 120,
    pattern: RhythmPattern = 'block'
  ): Promise<void> {
    if (!this.synth) await this.initializeTone();
    
    // Stop any existing playback
    this.stopPlayback();

    Tone.Transport.bpm.value = tempo;
    let sequencePattern: any[] = [];

    switch (pattern) {
      case 'block':
        // Play full chords
        sequencePattern = chords.map(chord => {
          const noteNames = chord.notes.map(note => `${note.name}${note.octave}`);
          return { notes: noteNames, duration: '2n' };
        });
        break;

      case 'arpeggio':
        // Play notes individually
        chords.forEach(chord => {
          chord.notes.forEach(note => {
            sequencePattern.push({
              notes: [`${note.name}${note.octave}`],
              duration: '8n'
            });
          });
        });
        break;

      case 'waltz':
        // Bass note + chord pattern (3/4 time)
        chords.forEach(chord => {
          const bassNote = chord.notes[0];
          const chordNotes = chord.notes.slice(1);
          
          sequencePattern.push(
            { notes: [`${bassNote.name}${bassNote.octave}`], duration: '4n' },
            { notes: chordNotes.map(n => `${n.name}${n.octave}`), duration: '8n' },
            { notes: chordNotes.map(n => `${n.name}${n.octave}`), duration: '8n' }
          );
        });
        break;

      case 'strum':
        // Quick arpeggiated strum
        chords.forEach(chord => {
          const noteNames = chord.notes.map(note => `${note.name}${note.octave}`);
          sequencePattern.push({ notes: noteNames, duration: '2n', strum: true });
        });
        break;
    }

    // Create and start sequence
    let index = 0;
    this.currentSequence = new Tone.Sequence((time, event) => {
      if (event.strum) {
        // Strum effect: slight delay between notes
        event.notes.forEach((note: string, i: number) => {
          this.synth?.triggerAttackRelease(note, event.duration, time + i * 0.01);
        });
      } else {
        this.synth?.triggerAttackRelease(event.notes, event.duration, time);
      }
    }, sequencePattern, '2n');

    this.currentSequence.start();
    this.isPlaying = true;
    
    // Auto-stop after sequence completes
    Tone.Transport.start();
    
    // Calculate total duration and auto-stop
    const totalDuration = sequencePattern.length * Tone.Time('2n').toSeconds();
    setTimeout(() => {
      this.stopPlayback();
    }, totalDuration * 1000);
  }

  // Stop playback
  stopPlayback() {
    if (this.currentSequence) {
      this.currentSequence.stop();
      this.currentSequence.dispose();
      this.currentSequence = null;
    }
    Tone.Transport.stop();
    this.isPlaying = false;
  }

  // Export to MIDI
  exportToMIDI(
    chords: Chord[],
    tempo: number = 120,
    pattern: RhythmPattern = 'block',
    filename: string = 'chord_progression'
  ): void {
    const track = new MidiWriter.Track();
    track.addEvent(new MidiWriter.ProgramChangeEvent({ instrument: 1 }));

    // Set tempo
    track.addEvent(new MidiWriter.TempoEvent({ bpm: tempo }));

    let currentTick = 0;
    const quarterNote = 128; // MIDI ticks per quarter note

    chords.forEach((chord, chordIndex) => {
      switch (pattern) {
        case 'block':
          // Play all notes simultaneously
          chord.notes.forEach(note => {
            const midiNote = this.noteToMidi(note.name, note.octave);
            track.addEvent(new MidiWriter.NoteEvent({
              pitch: midiNote,
              duration: '2', // half note
              startTick: currentTick
            }));
          });
          currentTick += quarterNote * 2; // Half note duration
          break;

        case 'arpeggio':
          // Play notes sequentially
          chord.notes.forEach((note, noteIndex) => {
            const midiNote = this.noteToMidi(note.name, note.octave);
            track.addEvent(new MidiWriter.NoteEvent({
              pitch: midiNote,
              duration: '8',
              startTick: currentTick
            }));
            currentTick += quarterNote / 2; // Eighth note duration
          });
          break;

        case 'waltz':
          // Bass + chord pattern
          const bassNote = this.noteToMidi(chord.notes[0].name, chord.notes[0].octave);
          track.addEvent(new MidiWriter.NoteEvent({
            pitch: bassNote,
            duration: '4',
            startTick: currentTick
          }));
          currentTick += quarterNote;

          // Chord on beats 2 and 3
          for (let beat = 0; beat < 2; beat++) {
            chord.notes.slice(1).forEach(note => {
              const midiNote = this.noteToMidi(note.name, note.octave);
              track.addEvent(new MidiWriter.NoteEvent({
                pitch: midiNote,
                duration: '8',
                startTick: currentTick
              }));
            });
            currentTick += quarterNote / 2;
          }
          break;

        case 'strum':
          // Strummed chord with slight timing offset
          chord.notes.forEach((note, noteIndex) => {
            const midiNote = this.noteToMidi(note.name, note.octave);
            track.addEvent(new MidiWriter.NoteEvent({
              pitch: midiNote,
              duration: '2', // half note
              startTick: currentTick + noteIndex * 2 // Slight strum delay
            }));
          });
          currentTick += quarterNote * 2;
          break;
      }
    });

    // Create and download MIDI file
    const write = new MidiWriter.Writer(track);
    const midiData = write.buildFile();
    const blob = new Blob([midiData], { type: 'audio/midi' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.mid`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Convert note name and octave to MIDI note number
  private noteToMidi(noteName: string, octave: number): number {
    const noteMap: Record<string, number> = {
      'C': 0, 'C#': 1, 'Db': 1,
      'D': 2, 'D#': 3, 'Eb': 3,
      'E': 4,
      'F': 5, 'F#': 6, 'Gb': 6,
      'G': 7, 'G#': 8, 'Ab': 8,
      'A': 9, 'A#': 10, 'Bb': 10,
      'B': 11
    };
    
    return (octave + 1) * 12 + noteMap[noteName];
  }

  // Check if currently playing
  get playing(): boolean {
    return this.isPlaying;
  }
}
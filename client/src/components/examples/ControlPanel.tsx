import { useState } from 'react';
import ControlPanel from '../ControlPanel';
import type { ProgressionStyle, RhythmPattern } from '@shared/schema';

export default function ControlPanelExample() {
  const [tempo, setTempo] = useState(120);
  const [style, setStyle] = useState<ProgressionStyle>('pop');
  const [rhythmPattern, setRhythmPattern] = useState<RhythmPattern>('block');
  const [progressionLength, setProgressionLength] = useState(4);

  const handleGenerateProgression = () => {
    console.log('Generating progression with:', { tempo, style, rhythmPattern, progressionLength });
  };

  const handleSave = () => {
    console.log('Saving progression');
  };

  const handleLoad = () => {
    console.log('Loading progression');
  };

  return (
    <div className="max-w-xs">
      <ControlPanel
        tempo={tempo}
        style={style}
        rhythmPattern={rhythmPattern}
        progressionLength={progressionLength}
        onTempoChange={setTempo}
        onStyleChange={setStyle}
        onRhythmPatternChange={setRhythmPattern}
        onProgressionLengthChange={setProgressionLength}
        onGenerateProgression={handleGenerateProgression}
        onSaveProgression={handleSave}
        onLoadProgression={handleLoad}
      />
    </div>
  );
}
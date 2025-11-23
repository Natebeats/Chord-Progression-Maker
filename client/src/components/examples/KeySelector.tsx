import { useState } from 'react';
import KeySelector from '../KeySelector';

export default function KeySelectorExample() {
  const [selectedKey, setSelectedKey] = useState('C');
  const [selectedMode, setSelectedMode] = useState<'major' | 'minor'>('major');

  return (
    <div className="p-4">
      <KeySelector
        selectedKey={selectedKey}
        selectedMode={selectedMode}
        onKeyChange={setSelectedKey}
        onModeChange={setSelectedMode}
      />
    </div>
  );
}
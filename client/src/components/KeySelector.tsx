import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface KeySelectorProps {
  selectedKey?: string;
  selectedMode?: 'major' | 'minor';
  onKeyChange?: (key: string) => void;
  onModeChange?: (mode: 'major' | 'minor') => void;
  className?: string;
}

const KEYS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const ENHARMONIC_KEYS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

export default function KeySelector({
  selectedKey = 'C',
  selectedMode = 'major',
  onKeyChange,
  onModeChange,
  className
}: KeySelectorProps) {
  
  const handleKeyChange = (key: string) => {
    console.log(`Key changed to: ${key}`);
    onKeyChange?.(key);
  };

  const handleModeChange = (mode: 'major' | 'minor') => {
    console.log(`Mode changed to: ${mode}`);
    onModeChange?.(mode);
  };

  const getModeColor = (mode: 'major' | 'minor') => {
    return mode === 'major' 
      ? 'bg-primary/20 text-primary border-primary/30'
      : 'bg-accent/20 text-accent border-accent/30';
  };

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Key</label>
        <Select value={selectedKey} onValueChange={handleKeyChange}>
          <SelectTrigger className="w-20" data-testid="select-key">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {KEYS.map((key, index) => (
              <SelectItem key={key} value={key}>
                <div className="flex items-center gap-2">
                  <span>{key}</span>
                  {key.includes('#') && (
                    <span className="text-xs text-muted-foreground">
                      ({ENHARMONIC_KEYS[index]})
                    </span>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Mode</label>
        <div className="flex gap-1">
          <button
            onClick={() => handleModeChange('major')}
            data-testid="button-mode-major"
            className={cn(
              'px-3 py-1 rounded-md text-sm font-medium transition-colors',
              selectedMode === 'major'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            )}
          >
            Major
          </button>
          <button
            onClick={() => handleModeChange('minor')}
            data-testid="button-mode-minor"
            className={cn(
              'px-3 py-1 rounded-md text-sm font-medium transition-colors',
              selectedMode === 'minor'
                ? 'bg-accent text-accent-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            )}
          >
            Minor
          </button>
        </div>
      </div>

      {/* Current Scale Display */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Current Scale</label>
        <Badge 
          variant="outline" 
          className={cn('text-sm px-3 py-1', getModeColor(selectedMode))}
        >
          {selectedKey} {selectedMode}
        </Badge>
      </div>
    </div>
  );
}
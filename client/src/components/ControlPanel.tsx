import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Music, Save, FolderOpen, Settings } from 'lucide-react';
import type { ProgressionStyle, RhythmPattern } from '@shared/schema';

interface ControlPanelProps {
  tempo?: number;
  style?: ProgressionStyle;
  rhythmPattern?: RhythmPattern;
  progressionLength?: number;
  onTempoChange?: (tempo: number) => void;
  onStyleChange?: (style: ProgressionStyle) => void;
  onRhythmPatternChange?: (pattern: RhythmPattern) => void;
  onProgressionLengthChange?: (length: number) => void;
  onGenerateProgression?: () => void;
  onSaveProgression?: () => void;
  onLoadProgression?: () => void;
  className?: string;
}

const STYLE_OPTIONS: { value: ProgressionStyle; label: string; description: string }[] = [
  { value: 'pop', label: 'Pop', description: 'I-V-vi-IV progression' },
  { value: 'jazz', label: 'Jazz', description: 'ii-V-I patterns' },
  { value: 'blues', label: 'Blues', description: 'I-I-IV-I progression' },
  { value: 'lofi', label: 'Lo-Fi', description: 'i-VII-VI-VII modal' },
  { value: 'random', label: 'Random', description: 'Random diatonic chords' },
];

const RHYTHM_OPTIONS: { value: RhythmPattern; label: string; description: string }[] = [
  { value: 'block', label: 'Block Chords', description: 'Full chords together' },
  { value: 'arpeggio', label: 'Arpeggios', description: 'Notes played individually' },
  { value: 'waltz', label: 'Waltz', description: 'Bass + chord pattern' },
  { value: 'strum', label: 'Strum', description: 'Guitar-like strumming' },
];

export default function ControlPanel({
  tempo = 120,
  style = 'pop',
  rhythmPattern = 'block',
  progressionLength = 4,
  onTempoChange,
  onStyleChange,
  onRhythmPatternChange,
  onProgressionLengthChange,
  onGenerateProgression,
  onSaveProgression,
  onLoadProgression,
  className
}: ControlPanelProps) {

  const handleTempoChange = (value: number[]) => {
    console.log(`Tempo changed to: ${value[0]}`);
    onTempoChange?.(value[0]);
  };

  const handleStyleChange = (newStyle: string) => {
    console.log(`Style changed to: ${newStyle}`);
    onStyleChange?.(newStyle as ProgressionStyle);
  };

  const handleRhythmChange = (pattern: string) => {
    console.log(`Rhythm pattern changed to: ${pattern}`);
    onRhythmPatternChange?.(pattern as RhythmPattern);
  };

  const handleLengthChange = (value: number[]) => {
    console.log(`Progression length changed to: ${value[0]}`);
    onProgressionLengthChange?.(value[0]);
  };

  const getStyleColor = (styleValue: ProgressionStyle) => {
    const colors = {
      pop: 'bg-primary/20 text-primary border-primary/30',
      jazz: 'bg-accent/20 text-accent border-accent/30',
      blues: 'bg-chart-1/20 text-chart-1 border-chart-1/30',
      lofi: 'bg-chart-2/20 text-chart-2 border-chart-2/30',
      random: 'bg-muted/20 text-muted-foreground border-muted/30'
    };
    return colors[styleValue] || colors.random;
  };

  return (
    <Card className={cn('p-6 space-y-6', className)}>
      <div className="flex items-center gap-2">
        <Settings className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Controls</h3>
      </div>

      {/* Style Selection */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Progression Style</Label>
        <Select value={style} onValueChange={handleStyleChange}>
          <SelectTrigger data-testid="select-style">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STYLE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center gap-3">
                  <div>
                    <div className="font-medium">{option.label}</div>
                    <div className="text-xs text-muted-foreground">
                      {option.description}
                    </div>
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Badge variant="outline" className={cn('text-xs', getStyleColor(style))}>
          {STYLE_OPTIONS.find(opt => opt.value === style)?.label}
        </Badge>
      </div>

      {/* Rhythm Pattern */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Rhythm Pattern</Label>
        <Select value={rhythmPattern} onValueChange={handleRhythmChange}>
          <SelectTrigger data-testid="select-rhythm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {RHYTHM_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <div>
                  <div className="font-medium">{option.label}</div>
                  <div className="text-xs text-muted-foreground">
                    {option.description}
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tempo Control */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Tempo</Label>
          <Badge variant="secondary" className="text-xs">
            {tempo} BPM
          </Badge>
        </div>
        <Slider
          value={[tempo]}
          onValueChange={handleTempoChange}
          min={60}
          max={200}
          step={5}
          className="w-full"
          data-testid="slider-tempo"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>60</span>
          <span>200</span>
        </div>
      </div>

      {/* Progression Length */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Length</Label>
          <Badge variant="secondary" className="text-xs">
            {progressionLength} chords
          </Badge>
        </div>
        <Slider
          value={[progressionLength]}
          onValueChange={handleLengthChange}
          min={2}
          max={16}
          step={1}
          className="w-full"
          data-testid="slider-length"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>2</span>
          <span>16</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-4 border-t">
        <Button
          onClick={onGenerateProgression}
          data-testid="button-generate"
          className="w-full"
        >
          <Music className="h-4 w-4 mr-2" />
          Generate Progression
        </Button>

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            onClick={onSaveProgression}
            data-testid="button-save"
          >
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button
            variant="outline"
            onClick={onLoadProgression}
            data-testid="button-load"
          >
            <FolderOpen className="h-4 w-4 mr-2" />
            Load
          </Button>
        </div>
      </div>
    </Card>
  );
}
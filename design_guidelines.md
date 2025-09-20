# Chord Progression Maker Design Guidelines

## Design Approach
**Reference-Based Approach**: Drawing inspiration from modern music production tools like Ableton Live, FL Studio, and Spotify's interface. This utility-focused application prioritizes functionality while maintaining an engaging, creative atmosphere.

## Core Design Elements

### Color Palette
**Dark Mode Primary** (Professional music studio aesthetic):
- Background: 220 15% 8% (Deep charcoal)
- Surface: 220 12% 12% (Elevated panels)
- Primary: 264 83% 70% (Rich purple - music/creativity)
- Secondary: 220 8% 85% (Light gray text)
- Accent: 168 76% 42% (Teal for active states)
- Success: 142 71% 45% (Chord validation)
- Warning: 38 92% 50% (MIDI export status)

### Typography
- **Primary**: Inter (Google Fonts) - Clean, technical readability
- **Headers**: 24px-32px, semibold
- **Body**: 14px-16px, regular
- **UI Labels**: 12px-14px, medium

### Layout System
**Tailwind Spacing**: Consistent use of 2, 4, 6, 8, 12, 16 units
- Component padding: p-4, p-6
- Section spacing: space-y-8, gap-6
- Button sizing: px-4 py-2, px-6 py-3

### Component Library

**Piano Interface**:
- Full keyboard spanning viewport width
- White keys: Clean white with subtle shadows
- Black keys: Charcoal with glossy finish
- Active chord notes: Purple highlight with glow effect
- Responsive design with touch-friendly sizing

**Chord Progression Builder**:
- Card-based chord slots with drag-and-drop capability
- Roman numeral notation prominently displayed
- Color-coded chord types (Major: purple, Minor: teal, Diminished: orange)
- Progress timeline with playback position indicator

**Control Panels**:
- Dark themed form controls with purple accents
- Dropdown menus with smooth animations
- Tempo slider with real-time visual feedback
- Export buttons with loading states

**Audio Visualization**:
- Waveform display during playback
- BPM indicator with pulsing animation
- Progress bars using gradient fills

### Key Features Layout
1. **Header**: Logo, key signature selector, tempo controls
2. **Main Piano**: Central interactive keyboard
3. **Progression Builder**: Horizontal chord sequence below piano
4. **Sidebar**: Scale selector, chord library, export options
5. **Footer**: Playback controls, MIDI export status

### Images
**No large hero image needed** - This is a utility application focused on interactive music creation tools. The piano keyboard serves as the primary visual element.

**Icon Requirements**:
- Music note icons for navigation
- Play/pause/stop controls (use Heroicons)
- Download icon for MIDI export
- Settings gear for preferences

### Accessibility & Interaction
- High contrast ratios for all text
- Keyboard navigation for all piano keys
- ARIA labels for screen readers on musical elements
- Visual feedback for chord changes and playback states
- Consistent focus indicators with purple outline

### Animation Philosophy
**Minimal and purposeful**:
- Smooth chord transitions (200ms ease)
- Subtle hover states on piano keys
- Progress indicators during export
- No distracting background animations

This design creates a professional, studio-quality interface that balances creative inspiration with technical precision, perfect for both amateur and professional musicians.
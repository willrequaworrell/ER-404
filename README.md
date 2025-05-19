# ER-404: Drum Machine/Sequencer Emulator

ER-404 Drum Machine Emulator is a powerful, React-based drum machine inspired by classic 80s/90s hardware like the Roland TR-909 but with a modern, digital twist. Create beats using a 16-step sequencer, swap in your own samples, apply on-board effects, and sculpt your mix with a full master FX suite.

<img width="1470" alt="Screenshot 2025-05-18 at 11 59 40 PM" src="https://github.com/user-attachments/assets/8e0280a9-b13f-40cd-af78-13d157ca8daf" />

## Features

- **16-step sequencer** for programming rhythmic patterns  
- **5 individual drum tracks** (Kick, Clap, Snare, Open Hat, Closed Hat)  
- **BPM control**: double click to edit or use up/down buttons to fine-tune tempo  
- **Sample selection**: swap between multiple kits per track (House, Trap, Garage, BoomBap)
- **Audio envelopes**: adjustable attack and decay parameters  
- **Sample FX**: built-in hp/lp filters + reverb and delay on each track  
- **Master FX**: compressor, master volume, and a three-band EQ  
- **State persistence**: patterns and settings automatically saved between reloads

## Technologies Used

- React with TypeScript for UI and state management  
- Tone.js for audio processing and scheduling  
- TailwindCSS for styling
- Motion for drag animations
- Local Storage API for saving user state  

## Installation

Clone the repo and install dependencies:

```bash
git clone https://github.com/yourusername/er-404-drum-machine.git
cd er-404-drum-machine
npm install
npm run dev
```

## Usage

**Programming Beats**  
Click grid cells to toggle steps. Press Play to start your sequence and Stop to pause. Press Reset to clear all patterns & settings

**Sound Customization**  
- Drag knobs to adjust volume, attack, decay, low-cut, and high-cut.  
- Double-click any knob to reset it to its default.  

**Sample FX**  
Enable and tweak filters, reverb and delay directly on each track for tone, depth and space.

**Master FX**  
Use compressor, master volume, and the three-band EQ (low, mid, high) to shape your overall mix.

**Sample Selection**  
Hover over a track name, click the arrow to open a dropdown, and choose from available kits.

**BPM Control**  
Click the caret icons to increment or decrement tempo, or hold them down for continuous adjustment. Alternatively, double click the BPM to enter a custom tempo from 50-200

## Future Enhancements

- Pattern saving and loading  
- MIDI input support  
- Audio export capabilities  
- Additional sample kits and FX  

## Acknowledgments

- Max Fung's Drumhaus was very helpful in getting through some of the oddities of Tone.js. Check it out here: https://github.com/mxfng/drumhaus 

---





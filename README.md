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
- Each row is a drum track (Kick, Clap, Snare, Open Hat, Closed Hat), each with 16 buttons representing steps in the sequence.
- Click buttons to toggle notes on/off.
- Switch between available sample kits for a track by hovering over the track name and selecting from the dropdown.

**Playback Section**  
- Global controls:
  - **Play**: Start sequence playback.
  - **Stop**: Pause playback.
  - **Reset**: Clear all patterns and settings.
  - **Spacebar**: Toggle play/pause.
- **BPM**: Adjust using up/down carets (hold to quickly change), or double-click the BPM to enter a custom tempo (50–200 BPM).
- **Swing**: Use the swing knob to add groove to your pattern.

**Sample Section**  
- Each track features:
  - Envelope controls (**Attack**, **Decay**)
  - FX controls (**High Cut**, **Low Cut** filters, **Reverb**, **Delay**)
  - **Mute** and **Solo** buttons for quick auditioning and isolation
  - **Keyboard Shortcuts**:  
    - Press `m` to mute the currently selected track  
    - Press `s` to solo the currently selected track

**Master Section**  
- Sculpt your overall mix using:
  - **3-band EQ** (Low, Mid, High)
  - **Compressor** (Ratio, Threshold)
  - **Master Volume**

**General**  
- **Double-click any knob** to reset it to its default value.

## Future Enhancements

- Pattern saving and loading  
- MIDI input support  
- Audio export capabilities  
- Additional sample kits and FX  

## Acknowledgments

- Max Fung's Drumhaus was very helpful in getting through some of the oddities of Tone.js. Check it out here: https://github.com/mxfng/drumhaus 

---





import { MasterFXSettingsType } from "../types/masterFXSettings";
import { TrackType } from "../types/track";
import * as Tone from 'tone'
import { mapKnobValueToRange } from "./knobValueHelpers";

export const applySampleKnobSettings = (tracks: TrackType[], ) => {

    // Apply saved track settings to audio nodes on initialization
    tracks.forEach(track => {
      // Apply volume
      track.volume.volume.value = mapKnobValueToRange(track.knobSettings.volume, -24, 4)
  
      // Apply filters
      track.lowCut.frequency.value = mapKnobValueToRange(track.knobSettings.lowCut, 0, 2000)
      track.highCut.frequency.value = mapKnobValueToRange(track.knobSettings.highCut, 2000, 20000)
      
      // Apply envelope
      track.envelope.attack = mapKnobValueToRange(track.knobSettings.attack , 0, 0.2)
      track.envelope.decay = mapKnobValueToRange(track.knobSettings.decay, 0.05, 3)
      
      // Apply effects
      track.reverb.wet.value = mapKnobValueToRange(track.knobSettings.reverb, 0, 0.5)
      track.reverb.decay = mapKnobValueToRange(track.knobSettings.reverb, 0.1, 3)
      track.delay.wet.value = mapKnobValueToRange(track.knobSettings.delay, 0, 0.75)
    });

}


export const applyMasterKnobSettings = (
    masterFXSettings: MasterFXSettingsType,
    masterCompressorRef: React.RefObject<Tone.Compressor | null>,
    masterEQLowRef: React.RefObject<Tone.Filter | null>, 
	masterEQMidRef: React.RefObject<Tone.Filter | null>,
    masterEQHighRef: React.RefObject<Tone.Filter | null>) => {

     // Apply master FX settings

     // Apply Compressor
     if (masterCompressorRef.current) {
        masterCompressorRef.current.threshold.value = mapKnobValueToRange(masterFXSettings.compressorThreshold, -30, 0)
        masterCompressorRef.current.ratio.value = mapKnobValueToRange(masterFXSettings.compressorRatio, 1, 8)
      }
      
      // Apply Hi/Lo Cut
      if (masterEQLowRef.current && masterEQMidRef.current && masterEQHighRef.current) {
        masterEQLowRef.current.gain.value = mapKnobValueToRange(masterFXSettings.eqLow, -6, 6)
        
        masterEQHighRef.current.gain.value = mapKnobValueToRange(masterFXSettings.eqHigh, -6, 6)
      }

      
      
      const masterVolumeDb = -60 + ((masterFXSettings.volume / 100) * 60);
      Tone.getDestination().volume.value = masterVolumeDb;

}



export const rebuildTrackChain = (track: TrackType, masterNodes: Array<Tone.ToneAudioNode>) => {
	// 1. Disconnect everything
	track.player.disconnect()
	track.envelope.disconnect()
	track.volume.disconnect()
	track.delay?.disconnect()
	track.reverb.disconnect()

	// 2. Build an array: always include these
	const nodes: Tone.ToneAudioNode[] = [
		track.envelope,
		track.lowCut,
		track.highCut,
		track.volume,
	];

	// 3. Conditionally insert delay
	if (track.knobSettings.delay > 0) {
		nodes.push(track.delay);
	}

	// 4. Then reverb
	nodes.push(track.reverb);

	// 5. Then any master chain nodes
	nodes.push(...masterNodes);

	// 6. Finally the destination
	nodes.push(Tone.getDestination());

	// 7. Chain them all
	track.player.chain(...nodes);
}

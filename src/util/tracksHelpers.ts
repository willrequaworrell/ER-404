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
    masterLowCutRef: React.RefObject<Tone.Filter | null>, 
    masterHighCutRef: React.RefObject<Tone.Filter | null>) => {

     // Apply master FX settings

     // Apply Compressor
     if (masterCompressorRef.current) {
        masterCompressorRef.current.threshold.value = mapKnobValueToRange(masterFXSettings.compressorThreshold, -30, 0)
        masterCompressorRef.current.ratio.value = mapKnobValueToRange(masterFXSettings.compressorRatio, 1, 8)
      }
      
      // Apply Hi/Lo Cut
      if (masterLowCutRef.current && masterHighCutRef.current) {
        masterLowCutRef.current.frequency.value = mapKnobValueToRange(masterFXSettings.lowCut, 0, 2000)
        
        masterHighCutRef.current.frequency.value = mapKnobValueToRange(masterFXSettings.highCut, 2000, 20000)
      }
      
      const masterVolumeDb = -60 + ((masterFXSettings.volume / 100) * 60);
      Tone.getDestination().volume.value = masterVolumeDb;

}
import { MasterFXSettingsType } from "../types/masterFXSettings";
import { TrackType } from "../types/track";
import * as Tone from 'tone'

export const applySampleKnobSettings = (tracks: TrackType[], ) => {


    // Apply saved track settings to audio nodes on initialization
    tracks.forEach(track => {
      // Apply volume
      const volumeDb = (-1 * 24) + ((track.knobSettings.volume / 100) * 24);
      track.volume.volume.value = volumeDb;
  
      // Apply filters
      const lowCutFreq = ((track.knobSettings.lowCut / 100) * 2000);
      track.lowCut.frequency.value = lowCutFreq;
      
      const highCutFreq = 20000 - ((track.knobSettings.highCut / 100) * (20000 - 2000));
      track.highCut.frequency.value = highCutFreq;
      
      // Apply envelope
      const attackSeconds = ((track.knobSettings.attack / 100) * 0.2);
      track.envelope.attack = attackSeconds;
      
      const decaySeconds = 0.05 + ((track.knobSettings.decay / 100) * (3 - 0.05));
      track.envelope.decay = decaySeconds;
      
      // Apply effects
      const reverbWet = (track.knobSettings.reverb / 100) * 0.5;
      track.reverb.wet.value = reverbWet;
      
      const reverbDecay = 0.1 + ((track.knobSettings.reverb / 100) * 2.9);
      track.reverb.decay = reverbDecay;
      
      const delayWet = (track.knobSettings.delay / 100);
      track.delay.wet.value = delayWet;
    });

}


export const applyMasterKnobSettings = (
    masterFXSettings: MasterFXSettingsType,
    masterCompressorRef: React.RefObject<Tone.Compressor | null>, 
    masterLowCutRef: React.RefObject<Tone.Filter | null>, 
    masterHighCutRef: React.RefObject<Tone.Filter | null>) => {

     // Apply master FX settings
     if (masterCompressorRef.current) {
        const thresholdVal = -30 + ((masterFXSettings.compressorThreshold / 100) * 30);
        masterCompressorRef.current.threshold.value = thresholdVal;
        
        const ratioVal = 1 + ((masterFXSettings.compressorRatio / 100) * 7);
        masterCompressorRef.current.ratio.value = ratioVal;
      }
      
      if (masterLowCutRef.current && masterHighCutRef.current) {
        const lowCutFreq = ((masterFXSettings.lowCut / 100) * 2000);
        masterLowCutRef.current.frequency.value = lowCutFreq;
        
        const highCutFreq = 20000 - ((masterFXSettings.highCut / 100) * (20000 - 2000));
        masterHighCutRef.current.frequency.value = highCutFreq;
      }
      
      const masterVolumeDb = -60 + ((masterFXSettings.volume / 100) * 60);
      Tone.getDestination().volume.value = masterVolumeDb;

}
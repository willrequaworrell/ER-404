import * as Tone from 'tone'

export interface MasterNodeRefsType {
    masterEQLowRef: React.RefObject<Tone.Filter | null>
    masterEQMidRef: React.RefObject<Tone.Filter | null>
    masterEQHighRef: React.RefObject<Tone.Filter | null>
    masterCompressorRef: React.RefObject<Tone.Compressor | null>
    masterLimiterRef: React.RefObject<Tone.Limiter | null>
    masterMeterRef: React.RefObject<Tone.Meter | null>
}
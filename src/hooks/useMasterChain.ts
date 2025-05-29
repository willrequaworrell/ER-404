import { useEffect, useRef, useState } from "react"
import * as Tone from 'tone'
import { MasterNodeRefsType } from "../types/MasterNodeRefs"

interface UseMasterChainReturnType {
    masterNodeRefs: MasterNodeRefsType
    masterNodes: Tone.ToneAudioNode[]
}

export const useMasterChain = (): UseMasterChainReturnType => {

    // create fx refs
    const masterEQLowRef = useRef<Tone.Filter | null>(null)
    const masterEQMidRef = useRef<Tone.Filter | null>(null)
    const masterEQHighRef = useRef<Tone.Filter | null>(null)
    const masterCompressorRef = useRef<Tone.Compressor | null>(null)
    const masterLimiterRef = useRef<Tone.Limiter | null>(null)

    const masterNodeRefs: MasterNodeRefsType = {
        masterEQLowRef: masterEQLowRef,
        masterEQMidRef: masterEQMidRef,
        masterEQHighRef: masterEQHighRef,
        masterCompressorRef: masterCompressorRef,
        masterLimiterRef: masterLimiterRef,
    }

    const [masterNodes, setMasterNodes] = useState<Tone.ToneAudioNode[]>([])

    // initialize master chain refs & dispose on unmount
    useEffect(() => {
        masterEQLowRef.current = new Tone.Filter(200, "lowshelf")
        masterEQMidRef.current = new Tone.Filter({
            type: "peaking",
            frequency: 1000,
            Q: 1,
            gain: 0
        })
        masterEQHighRef.current = new Tone.Filter(5000, "highshelf")
        masterCompressorRef.current = new Tone.Compressor({
            ratio: 8,
            threshold: 0,
            attack: 0.02,
            release: 0.1
        })
        masterLimiterRef.current = new Tone.Limiter(-0.5)

        setMasterNodes([
            masterEQLowRef.current!,
            masterEQMidRef.current!,
            masterEQHighRef.current!,
            masterCompressorRef.current!,
            masterLimiterRef.current!,
          ])

        return () => {
            masterEQLowRef.current?.dispose()
            masterEQMidRef.current?.dispose()
            masterEQHighRef.current?.dispose()
            masterCompressorRef.current?.dispose()
            masterLimiterRef.current?.dispose()
            setMasterNodes([])
        };
    }, []);


    return {masterNodeRefs, masterNodes}


}
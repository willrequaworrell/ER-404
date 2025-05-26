import { RefObject, useEffect, useRef } from 'react'
import * as Tone from 'tone'
import { allSamples } from '../util/samplesData'

export const useSamplePreload = (): RefObject<Record<string, Tone.Player>> => {

    const trackPlayersRef = useRef<Record<string, Tone.Player>>({})

    useEffect(() => {

        // get array of all sample urls
        const allSampleFilePaths = Object.values(allSamples).flat().map(sample => sample.file)

        // for each sample url, try to preload it once, then again on fail --> currently the buffer will just be empty on 2x failure
        allSampleFilePaths.forEach(async (filePath) => {
            if (!trackPlayersRef.current[filePath]) {
                const player = new Tone.Player({autostart: false})
                trackPlayersRef.current[filePath] = player
                try {
                    await player.load(filePath)
                    console.log("Successfully preloaded", filePath)
                } catch (error) {
                    console.error("Failed to preload", filePath, error)
                    const fallbackPlayer = new Tone.Player({url: filePath, autostart: false})
                    trackPlayersRef.current[filePath] = fallbackPlayer
                }
            }
        })
    }, [])

    return trackPlayersRef
}
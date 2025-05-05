import { useEffect, useRef } from 'react'
import * as Tone from 'tone'
import ScreenContainer from './ScreenContainer'

const SpectrumAnalyzer = () => {
    
    const analyzerRef = useRef<Tone.Analyser | null>(null)
    const canvasRef = useRef<HTMLCanvasElement | null>(null)

    useEffect(() => {

        analyzerRef.current = new Tone.Analyser("fft", 128)
        Tone.getDestination().connect(analyzerRef.current)

        


        const animate = () => {
            requestAnimationFrame(animate)

            const canvas = canvasRef.current
            const canvasContext = canvas?.getContext("2d")
            if (!canvas || !canvasContext) {
                console.error("Canvas and/or Canvas Context unavailable.")
                return
            }

            const spectrumData = analyzerRef.current?.getValue()
            if (!spectrumData) {
                console.error("Spectrum Data unavailable.")
                return
            }

            canvasContext?.clearRect(0,0, canvas?.width, canvas?.height)

            const barWidth = canvas.width /  spectrumData.length
            const gapWidth = barWidth
            spectrumData.forEach( (val, i) => {
                const barHeight = (typeof val === "number" ? val : 0) + 80 //check that array val is number, not array, handle edge case
                const x = i * (barWidth + gapWidth)
                const y = canvas.height - barHeight
                canvasContext.fillStyle = "#8e68d0"
                canvasContext.fillRect(x, y, barWidth, barHeight)
            })
        }
        animate()

        return () => {
            analyzerRef.current?.disconnect
        }
    } , [])


    return (
        <ScreenContainer
            styles='h-full w-min px-4'
        >
            <canvas ref={canvasRef} width={250} height={40}></canvas>

        </ScreenContainer>
            
    )
}

export default SpectrumAnalyzer

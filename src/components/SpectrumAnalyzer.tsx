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
                const barHeight = (typeof val === "number" ? val : 0) + ((canvas.height) + Number(val)) //check that array val is number, not array, handle edge case + do some weird math
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
        <div className='relative h-5/6 w-full flex justify-center items-center'>
            <div className="absolute w-full  h-[2px] -top-3 bg-text-primary "></div>
            <div className="absolute h-2 border-l left-0 -top-3 border-1 border-text-primary"></div>
            <div className="absolute h-2 border-r right-0 -top-3 border-1 border-text-primary"></div>
            <span className="absolute px-2 text-[.8rem] -translate-x-1/2 text-text-primary bg-background -top-6 left-1/2">ANALYZER</span>
            <ScreenContainer
                styles='h-full w-full px-4 pb-2  overflow-clip'
            >
                <canvas ref={canvasRef} className='w-full h-full '></canvas>

            </ScreenContainer>
            
        </div>
        
            
    )
}

export default SpectrumAnalyzer

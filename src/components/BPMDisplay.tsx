import ScreenContainer from "./ScreenContainer"
import { useTracksContext } from "../context/TracksContext"
import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react"
import Button from "./Button"
import { FaCaretDown, FaCaretUp } from "react-icons/fa"
import Knob from "./Knob"
import { useMasterFXContext } from "../context/MasterFXContext"

const MIN_BPM = 50
const MAX_BPM = 200

const BPMDisplay = () => {
    const {masterFXSettings, handleSetMasterFXSettings, resetMasterFXKnobValue} = useMasterFXContext()
    const { BPM, setBPM} = useTracksContext()

    const [isEditing, setIsEditing] = useState<boolean>(false)
    const [BPMDraft, setBPMDraft] = useState<string>(BPM.toString())

    const BPMInputRef = useRef<HTMLInputElement | null>(null)
    const intervalRef = useRef<number | null>(null)
    const timeoutRef = useRef<number | null>(null)
    
    const handleButtonActivate = ( type: 'increment' | 'decrement') => {
            
        if (type === "increment") {
            setBPM(prev => Math.min((prev + 1), 200))
        } else {
            setBPM(prev => Math.max((prev - 1), 50))
        }
        
        timeoutRef.current = setTimeout(() => {
            
            intervalRef.current = setInterval(() => {
                if (type === "increment") {
                    setBPM(prev => Math.min((prev + 1), 200))
                } else {
                    setBPM(prev => Math.max((prev - 1), 50))
                }
            }, 100)
            
    
        }, 500)
    }
    
    const handleButtonCleanup = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
        }
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
            timeoutRef.current = null
        }
    
    }


    const handleClick = () => {
        setBPMDraft(BPM.toString())
        setIsEditing(true)
        
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setBPMDraft(e.target.value)
    }

    const commitInput = () => {
        const input = Number(BPMDraft)
        if (!Number.isNaN(input)) {
            const inputInRange = Math.max(MIN_BPM, Math.min(MAX_BPM, input))
            setBPM(inputInRange)
        }
        setIsEditing(false)
    }

    const handleKeydown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            commitInput()
        }
    }

    // focus input when editing
    useEffect( () => {
        BPMInputRef.current?.focus()
        BPMInputRef.current?.select()
    }, [isEditing])


    return (
        <div className="relative flex items-center w-full h-5/6 gap-x-2">
            <div className="absolute w-full  h-[2px] -top-3 bg-text-primary "></div>
            <div className="absolute left-0 h-2 border-l -top-3 border-1 border-text-primary"></div>
            <div className="absolute right-0 h-2 border-r -top-3 border-1 border-text-primary"></div>
            <span className="absolute px-2 text-[.8rem] -translate-x-1/2 text-text-primary bg-background -top-6 left-1/2">TEMPO</span>
            <div className="relative flex w-3/4 h-full gap-x-4" >
                
                <div className="absolute w-full  h-[2px] -bottom-3 bg-text-primary "></div>
                <div className="absolute left-0 h-2 border-l -bottom-3 border-1 border-text-primary"></div>
                <div className="absolute right-0 h-2 border-r -bottom-3 border-1 border-text-primary"></div>
                <span className="absolute px-2 text-[.75rem] -translate-x-1/2 text-text-primary bg-background -bottom-5 left-1/2">BPM</span>

                <div className="flex flex-col justify-between w-1/3 h-full py-1 gap-y-2">
                    <Button
                        icon={<FaCaretUp />}
                        styles="w-full h-1/2"
                        onMouseDown={() => handleButtonActivate("increment")}
                        onMouseUp={handleButtonCleanup}
                        onMouseLeave={handleButtonCleanup}
                        onTouchStart={() => handleButtonActivate("increment")}
                        onTouchEnd={handleButtonCleanup}
                    />
                    <Button
                        icon={<FaCaretDown />}
                        styles="w-full h-1/2"
                        onMouseDown={() => handleButtonActivate("decrement")}
                        onMouseUp={handleButtonCleanup}
                        onMouseLeave={handleButtonCleanup}
                        onTouchStart={() => handleButtonActivate("decrement")}
                        onTouchEnd={handleButtonCleanup}
                    />
                </div>
                <div className="relative flex items-center w-2/3 h-full">
                    
                    <ScreenContainer
                        styles="h-full w-full text-[1.5rem]"
                        onClick={handleClick}
                    >
                        {isEditing ?         
                            <input 
                                ref={BPMInputRef}
                                type="number"
                                inputMode="numeric"
                                value={BPMDraft}
                                min={MIN_BPM}
                                max={MAX_BPM}
                                className="w-full text-center text-accent" 
                                onChange={handleChange}
                                onKeyDown={handleKeydown}
                                onBlur={() => setIsEditing(false)}
                            /> :
                            <p>{BPM}</p>
                        }

                        
                    </ScreenContainer>
                    
                </div>

            </div>
            <div className="relative w-1/4">
                <Knob
                    id="masterSwing"
                    label="Swing"
                    value={masterFXSettings.swing}
                    min={0}
                    max={100}
                    size="sm"
                    onChange={(_, value) => handleSetMasterFXSettings("swing", value)}
                    onDoubleClick={() => resetMasterFXKnobValue("masterSwing")}
                />

            </div>
        </div>
    )
}

export default BPMDisplay


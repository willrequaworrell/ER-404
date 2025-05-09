// import { FaCaretUp, FaCaretDown } from "react-icons/fa"
// import Button from "./Button"
import ScreenContainer from "./ScreenContainer"
import { useTracksContext } from "../context/TracksContext"
import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react"

const MIN_BPM = 50
const MAX_BPM = 200

const BPMDisplay = () => {
    const { BPM, setBPM } = useTracksContext()

    const [isEditing, setIsEditing] = useState<boolean>(false)
    const [BPMDraft, setBPMDraft] = useState<string>(BPM.toString())

    const BPMInputRef = useRef<HTMLInputElement | null>(null)
   


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
        <div className="flex items-center w-full h-5/6 gap-x-4">
            <div className="flex flex-col justify-between w-1/3 h-full py-1 gap-y-2">
                
            </div>
            <div className="relative flex flex-col-reverse items-center h-full w-2/3">
                <p className="absolute -top-[2.5vh] font-sans text-[.75rem]">TEMPO</p>
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
                            className="w-full text-accent text-center" 
                            onChange={handleChange}
                            onKeyDown={handleKeydown}
                            onBlur={() => setIsEditing(false)}
                        /> :
                        <p>{BPM}</p>
                    }

                    
                    {/* <p>{BPM}</p> */}
                </ScreenContainer>

            </div>
        </div>
    )
}

export default BPMDisplay



// const intervalRef = useRef<number | null>(null)
// const timeoutRef = useRef<number | null>(null)

// const handleButtonActivate = ( type: 'increment' | 'decrement') => {
        
//     if (type === "increment") {
//         setBPM(prev => Math.min((prev + 1), 200))
//     } else {
//         setBPM(prev => Math.max((prev - 1), 50))
//     }
    
//     timeoutRef.current = setTimeout(() => {
        
//         intervalRef.current = setInterval(() => {
//             if (type === "increment") {
//                 setBPM(prev => Math.min((prev + 1), 200))
//             } else {
//                 setBPM(prev => Math.max((prev - 1), 50))
//             }
//         }, 100)
        

//     }, 500)
// }

// const handleButtonCleanup = () => {
//     if (intervalRef.current) {
//         clearInterval(intervalRef.current)
//         intervalRef.current = null
//     }
//     if (timeoutRef.current) {
//         clearTimeout(timeoutRef.current)
//         timeoutRef.current = null
//     }

// }


// return (
//     <div className="flex items-center w-full h-5/6 gap-x-4">
//         <div className="flex flex-col justify-between w-1/3 h-full py-1 gap-y-2">
//             <Button
//                 icon={<FaCaretUp />}
//                 styles="w-full h-1/2"
//                 onMouseDown={() => handleButtonActivate("increment")}
//                 onMouseUp={handleButtonCleanup}
//                 onMouseLeave={handleButtonCleanup}
//                 onTouchStart={() => handleButtonActivate("increment")}
//                 onTouchEnd={handleButtonCleanup}
//             />
//             <Button
//                 icon={<FaCaretDown />}
//                 styles="w-full h-1/2"
//                 onMouseDown={() => handleButtonActivate("decrement")}
//                 onMouseUp={handleButtonCleanup}
//                 onMouseLeave={handleButtonCleanup}
//                 onTouchStart={() => handleButtonActivate("decrement")}
//                 onTouchEnd={handleButtonCleanup}
//             />
//         </div>
//         <div className="relative flex flex-col-reverse items-center h-full w-2/3">
//             <p className="absolute -top-[2.5vh] font-sans text-[.75rem]">TEMPO</p>
//             <ScreenContainer
//                 styles="h-full w-full text-[1.5rem]"
//             >
//                 <input 
//                     type="number"
//                     inputMode="numeric"
//                     min={50}
//                     max={200}
//                     className="w-full text-accent text-center" 

//                 />

                
//                 {/* <p>{BPM}</p> */}
//             </ScreenContainer>

//         </div>
//     </div>
// )
import { useState } from "react"
import ScreenContainer from "./ScreenContainer"

interface levelType {
    left: number
    right: number 
}

const VolumeMeter = () => {
    const [level, setLevel] = useState<levelType>({
        left: 0,
        right: 0
    })
    
    return (
        <ScreenContainer styles="px-4 gap-y-1 h-full flex-col">
            <div className="flex items-center justify-start w-full gap-x-1">
                <p className="pr-2">L</p>
                <div className="w-[.25rem] h-[1rem] bg-green-400"></div>
                <div className="w-[.25rem] h-[1rem] bg-green-400"></div>
                <div className="w-[.25rem] h-[1rem] bg-green-400"></div>
                <div className="w-[.25rem] h-[1rem] bg-green-400"></div>
                <div className="w-[.25rem] h-[1rem] bg-green-400"></div>
                <div className="w-[.25rem] h-[1rem] bg-green-400"></div>
                <div className="w-[.25rem] h-[1rem] bg-green-400"></div>
                <div className="w-[.25rem] h-[1rem] bg-yellow-200"></div>
                <div className="w-[.25rem] h-[1rem] bg-yellow-200"></div>
                <div className="w-[.25rem] h-[1rem] bg-yellow-200"></div>
                <div className="w-[.25rem] h-[1rem] bg-yellow-200"></div>
                <div className="w-[.25rem] h-[1rem] bg-yellow-200"></div>
                <div className="w-[.25rem] h-[1rem] bg-red-400"></div>
                {/* <div className="w-[.25rem] h-[1rem] bg-accent"></div>
                <div className="w-[.25rem] h-[1rem] bg-accent"></div> */}
            </div>
            <div className="flex items-center gap-x-1">
                <p className="pr-2">R</p>
                <div className="w-[.25rem] h-[1rem] bg-green-400"></div>
                <div className="w-[.25rem] h-[1rem] bg-green-400"></div>
                <div className="w-[.25rem] h-[1rem] bg-green-400"></div>
                <div className="w-[.25rem] h-[1rem] bg-green-400"></div>
                <div className="w-[.25rem] h-[1rem] bg-green-400"></div>
                <div className="w-[.25rem] h-[1rem] bg-green-400"></div>
                <div className="w-[.25rem] h-[1rem] bg-green-400"></div>
                <div className="w-[.25rem] h-[1rem] bg-yellow-200"></div>
                <div className="w-[.25rem] h-[1rem] bg-yellow-200"></div>
                <div className="w-[.25rem] h-[1rem] bg-yellow-200"></div>
                <div className="w-[.25rem] h-[1rem] bg-yellow-200"></div>
                <div className="w-[.25rem] h-[1rem] bg-yellow-200"></div>
                <div className="w-[.25rem] h-[1rem] bg-red-400"></div>
                <div className="w-[.25rem] h-[1rem] bg-red-400"></div>
                <div className="w-[.25rem] h-[1rem] bg-red-400"></div>
            </div>
            
        </ScreenContainer>
    )
}

export default VolumeMeter

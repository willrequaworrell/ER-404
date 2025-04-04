// import { useState } from "react"
import ScreenContainer from "./ScreenContainer"

// interface levelType {
//     left: number
//     right: number 
// }

const VolumeMeter = () => {
    // const [level, setLevel] = useState<levelType>({
    //     left: 0,
    //     right: 0
    // })
    
    return (

        <ScreenContainer styles="px-4 gap-x-1 h-[6rem]">
            <div className="flex flex-col-reverse items-center justify-start flex-grow gap-y-1">
                <p className="text-[.75rem]">L</p>
                <div className="h-[.25rem] w-[1rem] bg-green-400"></div>
                <div className="h-[.25rem] w-[1rem] bg-green-400"></div>
                <div className="h-[.25rem] w-[1rem] bg-green-400"></div>
                <div className="h-[.25rem] w-[1rem] bg-green-400"></div>
                <div className="h-[.25rem] w-[1rem] bg-yellow-200"></div>
                <div className="h-[.25rem] w-[1rem] bg-yellow-200"></div>
                <div className="h-[.25rem] w-[1rem] bg-red-400"></div>
                {/* <div className="w-[.25rem] h-[1rem] bg-accent"></div>
                <div className="w-[.25rem] h-[1rem] bg-accent"></div> */}
            </div>
            <div className="flex flex-col-reverse items-center justify-start flex-grow gap-y-1">
                <p className="text-[.75rem]">R</p>
                <div className="h-[.25rem] w-[1rem] bg-green-400"></div>
                <div className="h-[.25rem] w-[1rem] bg-green-400"></div>
                <div className="h-[.25rem] w-[1rem] bg-green-400"></div>
                <div className="h-[.25rem] w-[1rem] bg-green-400"></div>
                <div className="h-[.25rem] w-[1rem] bg-yellow-200"></div>
                <div className="h-[.25rem] w-[1rem] bg-yellow-200"></div>
                <div className="h-[.25rem] w-[1rem] bg-red-400"></div>
                {/* <div className="w-[.25rem] h-[1rem] bg-accent"></div>
                <div className="w-[.25rem] h-[1rem] bg-accent"></div> */}
            </div>
            
        </ScreenContainer>

    )

    // horizontal version
    // return (
    //     <ScreenContainer styles="px-4 gap-y-1 h-full flex-col">
    //         <div className="flex items-center justify-start w-full gap-x-1">
    //             <p className="pr-2">L</p>
    //             <div className="w-[.25rem] h-[1rem] bg-green-400"></div>
    //             <div className="w-[.25rem] h-[1rem] bg-green-400"></div>
    //             <div className="w-[.25rem] h-[1rem] bg-green-400"></div>
    //             <div className="w-[.25rem] h-[1rem] bg-green-400"></div>
    //             <div className="w-[.25rem] h-[1rem] bg-green-400"></div>
    //             <div className="w-[.25rem] h-[1rem] bg-green-400"></div>
    //             <div className="w-[.25rem] h-[1rem] bg-green-400"></div>
    //             <div className="w-[.25rem] h-[1rem] bg-yellow-200"></div>
    //             <div className="w-[.25rem] h-[1rem] bg-yellow-200"></div>
    //             <div className="w-[.25rem] h-[1rem] bg-yellow-200"></div>
    //             <div className="w-[.25rem] h-[1rem] bg-yellow-200"></div>
    //             <div className="w-[.25rem] h-[1rem] bg-yellow-200"></div>
    //             <div className="w-[.25rem] h-[1rem] bg-red-400"></div>
    //             {/* <div className="w-[.25rem] h-[1rem] bg-accent"></div>
    //             <div className="w-[.25rem] h-[1rem] bg-accent"></div> */}
    //         </div>
    //         <div className="flex items-center gap-x-1">
    //             <p className="pr-2">R</p>
    //             <div className="w-[.25rem] h-[1rem] bg-green-400"></div>
    //             <div className="w-[.25rem] h-[1rem] bg-green-400"></div>
    //             <div className="w-[.25rem] h-[1rem] bg-green-400"></div>
    //             <div className="w-[.25rem] h-[1rem] bg-green-400"></div>
    //             <div className="w-[.25rem] h-[1rem] bg-green-400"></div>
    //             <div className="w-[.25rem] h-[1rem] bg-green-400"></div>
    //             <div className="w-[.25rem] h-[1rem] bg-green-400"></div>
    //             <div className="w-[.25rem] h-[1rem] bg-yellow-200"></div>
    //             <div className="w-[.25rem] h-[1rem] bg-yellow-200"></div>
    //             <div className="w-[.25rem] h-[1rem] bg-yellow-200"></div>
    //             <div className="w-[.25rem] h-[1rem] bg-yellow-200"></div>
    //             <div className="w-[.25rem] h-[1rem] bg-yellow-200"></div>
    //             <div className="w-[.25rem] h-[1rem] bg-red-400"></div>
    //             <div className="w-[.25rem] h-[1rem] bg-red-400"></div>
    //             <div className="w-[.25rem] h-[1rem] bg-red-400"></div>
    //         </div>
            
    //     </ScreenContainer>
    // )
}

export default VolumeMeter

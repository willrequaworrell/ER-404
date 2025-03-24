import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";

interface GlobalStateContextType {
    BPM: number
    setBPM: Dispatch<SetStateAction<number>>
}

const GlobalStateContext = createContext<GlobalStateContextType | null>(null)

export const GlobalStateProvider = ({children}: {children: ReactNode}) => {

    const [BPM, setBPM] = useState<number>(120)

    return (
        <GlobalStateContext.Provider value={{BPM, setBPM}}>
            {children}
        </GlobalStateContext.Provider>
    )
}

export const useGlobalStateContext = () => {
    const context = useContext(GlobalStateContext)
    if (!context) {
        throw new Error("No Global State Context")
    }
    return context
}
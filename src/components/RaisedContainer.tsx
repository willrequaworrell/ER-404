import { ReactNode } from "react"

interface RaisedContainerPropsType {
    children: ReactNode
    styles?: string
    noShadow?: boolean
}

// add flex-1 to allow it to grow into available space 

const RaisedContainer = ({children, styles="", noShadow=false}:RaisedContainerPropsType) => {
    
    return (
        <div 
            className={`
                flex 
                justify-center
                items-stretch
                w-full
                h-full
                p-8
                bg-background 
                rounded-2xl
                ${!noShadow && "shadow-[4px_4px_6px_#b0c0c9,-4px_-4px_6px_#ffffff]"} 
                ${styles}`
            }
        >
            {children}
        </div>
    )
}

export default RaisedContainer

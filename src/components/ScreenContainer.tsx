import { MouseEventHandler, ReactNode } from "react"

interface ScreenContainerPropsType {
    children: ReactNode
    styles?: string
    onClick?: MouseEventHandler<HTMLDivElement>
}

const ScreenContainer = ({children, styles="", onClick}: ScreenContainerPropsType) => {
    return (
        <div className={`
            flex
            justify-center
            items-center
            bg-black 
            rounded-2xl
            font-digital
            text-accent
            shadow-[0px_0px_0px_#00000040,0px_2px_3px_#0000003d,0px_-1px_1px_#ffffff24,inset_0px_1px_1px_2px_#ffffff66]
            ${styles}
        `}
        onClick={onClick}
        >
            {children}
        </div>
    )
}

export default ScreenContainer

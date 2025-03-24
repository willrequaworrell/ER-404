import { MouseEventHandler, ReactNode } from "react"

interface ButtonPropsType {
    icon: ReactNode
    styles?: string
    onClick?: MouseEventHandler<HTMLButtonElement>
}

const Button = ({icon, styles="", onClick}:ButtonPropsType) => {
    return (
        <button 
            type="button"
            onClick={onClick}
            className={`
                flex
                justify-center
                items-center
                bg-background 
                rounded-2xl 
                shadow-[4px_4px_6px_#b0c0c9,-4px_-4px_6px_#ffffff]
                active:shadow-[inset_-4px_-4px_9px_#ffffffe0,inset_2px_2px_4px_#718eab1a]
                transition-all
                cursor-pointer
                ${styles} 
            `}
        >
            {icon}
        </button>
    )
}

export default Button

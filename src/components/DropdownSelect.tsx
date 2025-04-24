import { useState } from "react"

interface DropdownSelectPropsType {
    trackIndex: number
    options: string[]
    value: string
    // onChange: () => void
    onChange: (trackIndex: number, newSampleName: string) => void
    arrowVisible?: boolean
}


const DropdownSelect = ({trackIndex, options, value, onChange, arrowVisible=true}: DropdownSelectPropsType) => {
    const [isOpen, setIsOpen] = useState<boolean>(false)

    const toggleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation()
        setIsOpen(prev => !prev)
    }

    const handleSelectSample = (event: React.MouseEvent<HTMLLIElement>, selectedSample: string) => {
        event.stopPropagation()
        onChange(trackIndex, selectedSample)
        setIsOpen(false)
    }

    return (
        <div className="relative">
            <button
                onClick={(event) => toggleOpen(event)}
                className={`text-[.75rem] cursor-pointer ${isOpen || arrowVisible  ? "opacity-100" : "opacity-0"} transition-all ease-in-out`}
            >
                {isOpen ? "▲" : "▼"}
            </button>
            {isOpen && (
                <div className="absolute flex justify-start items-center left-0 z-20 w-[6vw] bg-black border border-accent p-2 rounded-b-sm text-white top-full">
                    <ul className="w-full">
                        {options.map(option => (
                            <li
                                key={option}
                                onClick={(event) => handleSelectSample(event, option)} 
                                className={`w-full border-b hover:text-accent border-accent`}
                            >
                                <button 
                                    type="button" 
                                    className={`cursor-pointer ${option === value && "text-accent"}`}> {option}</button>
                            </li>
                        ) )}
                    </ul>
                </div>
            )}
        </div>
    )
}

export default DropdownSelect

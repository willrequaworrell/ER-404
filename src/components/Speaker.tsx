const Speaker = () => {
    const rows = [
        35, 
        37,
        38,
        // 38,
        // 38,
        38,
        38,
        37,
        35,
    ];

    return (
        <div className=" flex items-center gap-x-[2vw] ">
            <div className="flex flex-col items-center justify-center gap-1">
                {rows.map((cols, rowIndex) => (
                    <div
                        key={rowIndex}
                        className="flex justify-center gap-1"
                    >
                        {Array.from({ length: cols }).map((_, colIndex) => (
                            <div
                                key={colIndex}
                                className="w-1 h-1 bg-black rounded-full"
                            ></div>
                        ))}
                    </div>
                ))}
            </div>
            <div className="flex flex-col items-center justify-center gap-1">
                {rows.map((cols, rowIndex) => (
                    <div
                        key={rowIndex}
                        className="flex justify-center gap-1"
                    >
                        {Array.from({ length: cols }).map((_, colIndex) => (
                            <div
                                key={colIndex}
                                className="w-1 h-1 bg-black rounded-full"
                            ></div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Speaker;

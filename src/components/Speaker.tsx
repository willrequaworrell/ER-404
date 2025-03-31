const Speaker = () => {
    const rows = [
        // 28, // Second row: 5 holes
        44, // Middle row: 7 holes
        46,
        48,
        48,
        48,
        48,
        48,
        46,
        44,
    ];

    return (
        <div className="absolute flex items-center -translate-x-1/2 -translate-y-1/2 gap-x-24 top-1/2 left-1/2">
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

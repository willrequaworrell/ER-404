const Speaker = () => {
    const rows = [
        // 28, // Second row: 5 holes
        32, // Middle row: 7 holes
        35,
        36,
        36,
        36,
        36,
        36,
        35,
        32,
    ];
    // const rows = [
    //     4, // Second row: 5 holes
    //     7, // Middle row: 7 holes
    //     9,
    //     10,
    //     10,
    //     10,
    //     9,
    //     7,
    //     4, // Fourth row: 5 holes
    // ];

    return (
        <div className="absolute flex flex-col items-center justify-center gap-1 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
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
    );
};

export default Speaker;

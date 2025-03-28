import React, { useState, useCallback } from 'react';

interface KnobPropsType {
    label: string
}

const Knob = ({label}: KnobPropsType) => {
  const [rotation, setRotation] = useState(0);

  const handleRotate = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
    setRotation(angle + 90);
  }, []);

  return (
    <div className='flex flex-col items-center justify-end h-full gap-y-2'>

        <div className="relative flex items-center justify-center size-[2.75rem]">
        {/* Outer bevel ring */}
        <div
            className="absolute inset-0 rounded-full bg-accent/50
            shadow-[4px_4px_8px_rgba(0,0,0,0.15),-4px_-4px_8px_rgba(255,255,255,0.9)]"
        ></div>

        {/* Main knob */}
        <div
            className="relative size-[2.5rem] rounded-full bg-background 
            shadow-[6px_6px_12px_rgba(0,0,0,0.15),-6px_-6px_12px_rgba(255,255,255,0.8)]"
            onMouseMove={(e) => e.buttons === 1 && handleRotate(e)}
            onMouseDown={handleRotate}
        >
            {/* Small recessed circular area (dot) */}
            <div
            className="absolute size-[0.25rem] bg-accent rounded-full 
                shadow-[inset_1px_1px_2px_rgba(0,0,0,0.3),inset_-1px_-1px_2px_rgba(255,255,255,0.5)]"
            style={{
                top: "75%",
                left: "35%",
            }}
            ></div>
        </div>
        
        </div>
        <div className="text-[.75rem] text-text-primary">{label}</div>
    </div>
    
  );
};

export default Knob;

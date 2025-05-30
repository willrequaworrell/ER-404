import { useEffect } from "react";

interface UseKeyboardShortcutsPropsType {
    isPlaying: boolean
    globalPlay: () => void
    globalStop: () => void
    handleToggleTrackMute: (trackIndex: number) => void
    handleToggleTrackSolo: (trackIndex: number) => void
    currentTrack: number
}

export const useKeyboardShortcuts = ({
    isPlaying, 
    globalPlay, 
    globalStop, 
    handleToggleTrackMute, 
    handleToggleTrackSolo,
    currentTrack}: UseKeyboardShortcutsPropsType) => {

    // handle key stroke functionality
    useEffect( () => {

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === "Space") {
                e.preventDefault();
                if (isPlaying) {
                    globalStop();
                } else {
                    globalPlay();
                }
            } else if (e.code === "KeyS") {
                handleToggleTrackSolo(currentTrack)
            } else if (e.code === "KeyM") {
                handleToggleTrackMute(currentTrack)
            }
        };

        window.addEventListener("keydown", handleKeyDown)

        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isPlaying, globalPlay, globalStop])
}
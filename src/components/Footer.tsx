
const Footer = () => {
    return (
        <div className="absolute flex  justify-center items-center bottom-0 p-2 gap-x-2 left-1/2 -translate-x-1/2 text-sm">
            <p>Designed & Developed by <a className="hover:underline hover:text-background" target="_blank" href="https://www.willworrell.dev/">Will Worrell</a></p>
            <p>|</p>
            <a className="text-shadow-red-500 hover:underline hover:text-background" target="_blank" href="https://forms.gle/bHeBg2cMW2JWYsAEA">Leave Feedback</a>
        </div>
    )
}

export default Footer

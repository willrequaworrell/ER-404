import ScreenContainer from "./ScreenContainer"
import TimelineTick from "./TimelineTick"

const Timeline = () => {
    return (
        <ScreenContainer styles="flex-1">
            <div className="flex justify-between flex-1 px-8">
                <TimelineTick text="1" beatIndex={0}/>
                <TimelineTick text="•" beatIndex={1}/>
                <TimelineTick text="•" beatIndex={2}/>
                <TimelineTick text="•" beatIndex={3}/>
                <TimelineTick text="2" beatIndex={4}/>
                <TimelineTick text="•" beatIndex={5}/>
                <TimelineTick text="•" beatIndex={6}/>
                <TimelineTick text="•" beatIndex={7}/>
                <TimelineTick text="3" beatIndex={8}/>
                <TimelineTick text="•" beatIndex={9}/>
                <TimelineTick text="•" beatIndex={10}/>
                <TimelineTick text="•" beatIndex={11}/>
                <TimelineTick text="4" beatIndex={12}/>
                <TimelineTick text="•" beatIndex={13}/>
                <TimelineTick text="•" beatIndex={14}/>
                <TimelineTick text="•" beatIndex={15}/>
            </div>
        </ScreenContainer>
    )
}

export default Timeline

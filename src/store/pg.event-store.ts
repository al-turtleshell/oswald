import { appendEventsToStream } from "./append-events-to-stream"
import { loadEventStream } from "./load-event-stream"


const PgEventStore = {
    loadEventStream,
    appendEventsToStream
}

export { PgEventStore }
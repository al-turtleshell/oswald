export interface OutboxStore {
    findPendingEvents(): Promise<Record<string, any>[]>;
    // markAsProcessed(event: Event): Promise<void>;
}

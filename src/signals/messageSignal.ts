// src/signals/messageSignal.ts

import { signal } from "@preact/signals-react";
import type { message } from "../types";

// The signal now holds an array of messages, initialized as empty
export const messagesSignal = signal<message[]>([]);

// Define a type for the data needed to create a message (without the id)
type MessageData = Omit<message, 'id'>;

export function showMessage(messageData: MessageData) {
    const newMessage: message = {
        ...messageData,
        id: Date.now() + Math.random(), // Generate a simple unique ID
    };

    // Add the new message to the end of the current array of messages
    messagesSignal.value = [...messagesSignal.value, newMessage];
}

export function removeMessage(id: number) {
    // Filter the array, keeping all messages except the one with the matching id
    messagesSignal.value = messagesSignal.value.filter(msg => msg.id !== id);
}
export interface User {
    name: string;
    email: string;
    avatarUrl: string;
}

export interface Attachment {
    id: string;
    filename: string;
    size: string;
    type: string;
    url: string;
}

export interface Recipient {
    type: 'to' | 'cc' | 'bcc';
    email: string;
}

export interface Email {
    id: string;
    folder: string;
    labels: string[];
    sender: User;
    recipients: Recipient[];
    subject: string;
    snippet: string;
    body: string;
    timestamp: string;
    isRead: boolean;
    isStarred: boolean;
    attachments: Attachment[];
}

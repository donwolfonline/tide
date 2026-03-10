import { Email } from '../types';
import { useEmailStore } from '../store/emailStore';
import { useAuthStore } from '../store/authStore';

/** Simulate sending an email — adds to Sent folder */
export const sendEmail = (params: {
    to: string;
    cc?: string;
    bcc?: string;
    subject: string;
    body: string;
}): void => {
    const currentUser = useAuthStore.getState().currentUser;
    if (!currentUser) return;

    const email: Email = {
        id: `msg_${Date.now()}`,
        folder: 'sent',
        labels: [],
        sender: {
            name: currentUser.displayName,
            email: currentUser.email,
            avatarUrl: '',
        },
        recipients: [
            { type: 'to', email: params.to },
            ...(params.cc ? [{ type: 'cc' as const, email: params.cc }] : []),
            ...(params.bcc ? [{ type: 'bcc' as const, email: params.bcc }] : []),
        ],
        subject: params.subject || '(no subject)',
        snippet: params.body.replace(/<[^>]*>/g, '').slice(0, 120),
        body: `<p>${params.body.replace(/\n/g, '</p><p>')}</p>`,
        timestamp: new Date().toISOString(),
        isRead: true,
        isStarred: false,
        attachments: [],
    };

    useEmailStore.getState().addEmail(email);

    // Simulate a reply arriving after 5 seconds
    if (params.to.endsWith('@tmail.com')) {
        setTimeout(() => simulateIncomingReply(email, currentUser.email), 5000);
    }
};

/** Simulate an auto-reply arriving in inbox */
const simulateIncomingReply = (original: Email, myEmail: string) => {
    const reply: Email = {
        id: `msg_reply_${Date.now()}`,
        folder: 'inbox',
        labels: [],
        sender: {
            name: original.recipients[0].email.split('@')[0].replace('.', ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
            email: original.recipients[0].email,
            avatarUrl: '',
        },
        recipients: [{ type: 'to', email: myEmail }],
        subject: `Re: ${original.subject}`,
        snippet: 'Thanks for your message! I\'ll get back to you soon.',
        body: `<p>Thanks for your message!</p><p>I\'ll get back to you soon.</p>`,
        timestamp: new Date().toISOString(),
        isRead: false,
        isStarred: false,
        attachments: [],
    };

    useEmailStore.getState().addEmail(reply);
};

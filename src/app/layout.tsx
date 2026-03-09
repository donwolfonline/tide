import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Tide — Search the Web",
    description: "Tide is a powerful, beautifully designed search engine that helps you discover the world's information.",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body>{children}</body>
        </html>
    );
}

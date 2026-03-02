import { Spline_Sans } from "next/font/google";
import "./globals.css";

const splineSans = Spline_Sans({
    subsets: ["latin"],
    variable: "--font-display",
    weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
    title: "Grammar Paws Adventure",
    description: "Grammar Paws Adventure MVP",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" className="light">
            <head>
                <link
                    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body className={`${splineSans.variable} font-display bg-background-light text-slate-900 min-h-screen`}>
                {children}
            </body>
        </html>
    );
}

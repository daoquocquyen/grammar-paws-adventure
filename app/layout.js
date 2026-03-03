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
            <body className={`${splineSans.variable} font-display text-slate-900 min-h-screen relative overflow-x-hidden`}>
                <div className="gpa-kid-bg" aria-hidden="true">
                    <span className="material-symbols-outlined gpa-kid-icon gpa-kid-icon-cloud-left">cloud</span>
                    <span className="material-symbols-outlined gpa-kid-icon gpa-kid-icon-cloud-right">cloud</span>
                    <span className="material-symbols-outlined gpa-kid-icon gpa-kid-icon-star-top">star</span>
                    <span className="material-symbols-outlined gpa-kid-icon gpa-kid-icon-star-mid">star</span>
                    <span className="material-symbols-outlined gpa-kid-icon gpa-kid-icon-sparkle">auto_awesome</span>
                    <span className="material-symbols-outlined gpa-kid-icon gpa-kid-icon-sparkle-right">auto_awesome</span>
                    <span className="material-symbols-outlined gpa-kid-icon gpa-kid-icon-balloon">featured_seasonal_and_gifts</span>
                    <span className="material-symbols-outlined gpa-kid-icon gpa-kid-icon-paw">pets</span>
                    <span className="material-symbols-outlined gpa-kid-icon gpa-kid-icon-school">school</span>
                    <span className="material-symbols-outlined gpa-kid-icon gpa-kid-icon-heart">favorite</span>
                    <span className="material-symbols-outlined gpa-kid-icon gpa-kid-icon-puzzle">extension</span>
                    <span className="material-symbols-outlined gpa-kid-icon gpa-kid-icon-smile">sentiment_very_satisfied</span>
                    <span className="material-symbols-outlined gpa-kid-icon gpa-kid-icon-bone">pets</span>
                </div>
                <div className="relative z-10">{children}</div>
            </body>
        </html>
    );
}

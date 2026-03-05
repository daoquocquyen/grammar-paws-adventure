"use client";

import Link from "next/link";

export default function ChallengePage() {
    return (
        <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center justify-center px-6 py-10 text-center">
            <h1 className="text-4xl font-black text-slate-900">Challenge</h1>
            <p className="mt-3 text-base font-semibold text-slate-600">
                Your grammar challenge session is ready.
            </p>
            <Link
                href="/topic-intro"
                className="mt-8 inline-flex items-center gap-2 rounded-full border-2 border-primary bg-white px-6 py-3 text-sm font-black text-primary"
            >
                Back to Topic Intro
            </Link>
        </main>
    );
}

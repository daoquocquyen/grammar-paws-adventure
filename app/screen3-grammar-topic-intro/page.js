"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const profileStorageKey = "gpa_player_profile_v1";
const selectedTopicStorageKey = "gpa_selected_topic_v1";

const defaultAvatar =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCLzcyBcB1kXBKC87wVxPydRH8Z6etHELsVc2a1F90LjG3faXsG9lcV1nj4uPhMSLAcvG1K9WOjsOJUuFf9vn8cBvgVinFbMVfVQ4ZsvoqR4VsFMMOjU7W5ziFsCOdbm7y1Hzdi2OKt3DanVq7pUtiZPHqlA4Mp83miQek9iHzud_HcCndkFiA08inxZL51ILoGwd7eaPfnNDpGQDJ2JVcaceXxCStVVVV0SO1cUgoyLzo3h93o1VTGgpLm4BvSOg96jdnpWU7crOjd";

const topicLabels = {
    nouns: "Nouns",
    verbs: "Verbs",
    pronouns: "Pronouns",
};

export default function Screen3TopicIntroPage() {
    const [headerName, setHeaderName] = useState("Adventurer");
    const [headerPetText, setHeaderPetText] = useState("Choose your first topic");
    const [headerAvatar, setHeaderAvatar] = useState(defaultAvatar);
    const [topicLabel, setTopicLabel] = useState("Verbs");

    useEffect(() => {
        const profileRaw = localStorage.getItem(profileStorageKey);
        if (profileRaw) {
            try {
                const profile = JSON.parse(profileRaw);
                if (typeof profile?.name === "string" && profile.name.trim()) {
                    setHeaderName(profile.name.trim());
                }
                if (typeof profile?.petName === "string" && profile.petName.trim()) {
                    setHeaderPetText(`${profile.petName.trim()} companion`);
                }
                if (typeof profile?.petImage === "string" && profile.petImage.trim()) {
                    setHeaderAvatar(profile.petImage.trim());
                }
            } catch (error) {
                console.error("Failed to parse player profile", error);
            }
        }

        const selectedTopic = localStorage.getItem(selectedTopicStorageKey);
        if (selectedTopic && topicLabels[selectedTopic]) {
            setTopicLabel(topicLabels[selectedTopic]);
        }
    }, []);

    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light text-slate-900">
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-primary/10 px-6 md:px-20 py-4 bg-white/80 backdrop-blur-md sticky top-0 z-50 md:py-6">
                <div className="max-w-[1320px] w-full mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary p-2 rounded-full shadow-lg shadow-primary/30 text-white">
                            <span className="material-symbols-outlined text-2xl">pets</span>
                        </div>
                        <div className="text-left">
                            <h1 className="text-xl font-black tracking-tight text-primary">Grammar Paws Adventure</h1>
                            <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Level 12 • Explorer</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 ml-auto">
                        <div className="hidden md:flex flex-col items-end mr-2">
                            <span className="text-sm font-bold text-slate-700">{headerName}</span>
                            <span className="text-xs text-primary font-medium">{headerPetText}</span>
                        </div>
                        <div className="size-12 rounded-full border-4 border-white shadow-md overflow-hidden bg-slate-200">
                            <img className="w-full h-full object-cover" src={headerAvatar} alt="Player avatar" />
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 px-4 md:px-6 lg:px-8 max-w-[1320px] mx-auto w-full py-8">
                <section className="bg-white border border-slate-200 rounded-[24px] p-6 text-center">
                    <p className="text-xs font-black uppercase tracking-widest text-primary mb-2">Topic Intro</p>
                    <h2 className="text-3xl font-black text-slate-900 mb-2">{topicLabel}</h2>
                    <p className="text-slate-600 text-base font-medium">Great choice! Intro content is ready to load before challenge.</p>

                    <div className="mt-6 flex items-center justify-center gap-3">
                        <button
                            type="button"
                            className="px-6 py-2.5 bg-primary text-white rounded-full font-black text-sm shadow-lg shadow-primary/25"
                        >
                            Start Challenge
                        </button>
                        <Link
                            href="/screen2-world-map-topic-selection"
                            className="px-6 py-2.5 border-2 border-primary text-primary rounded-full font-black text-sm bg-white"
                        >
                            Back to Map
                        </Link>
                    </div>
                </section>
            </main>
        </div>
    );
}

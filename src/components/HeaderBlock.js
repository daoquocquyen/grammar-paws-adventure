export default function HeaderBlock({ headerName, headerPetText, headerAvatar }) {
    return (
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-primary/10 px-6 md:px-20 py-4 bg-white/80 backdrop-blur-md sticky top-0 z-50 md:py-6">
            <div className="max-w-[1320px] w-full mx-auto flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-primary p-2 rounded-full shadow-lg shadow-primary/30 text-white">
                        <span className="material-symbols-outlined text-2xl">pets</span>
                    </div>
                    <div className="text-left">
                        <h2 className="text-primary text-xl font-extrabold leading-tight tracking-tight">Grammar Paws Adventure</h2>
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
    );
}

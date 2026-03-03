export default function HeaderBlock() {
    return (
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-primary/10 px-6 md:px-20 py-4 bg-white/80 backdrop-blur-md sticky top-0 z-50 md:py-6">
            <div className="max-w-[1320px] w-full mx-auto flex items-center justify-start">
                <div className="flex items-center gap-3">
                    <div className="bg-primary p-2 rounded-full shadow-lg shadow-primary/30 text-white">
                        <span className="material-symbols-outlined text-2xl">pets</span>
                    </div>
                    <div className="text-left">
                        <h2 className="text-primary text-xl font-extrabold leading-tight tracking-tight">Grammar Paws Adventure</h2>
                        <p className="text-xs font-medium text-slate-500">Learn grammar, unlock pet powers!</p>
                    </div>
                </div>
            </div>
        </header>
    );
}

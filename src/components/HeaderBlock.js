export default function HeaderBlock({
    title = "Grammar Paws Adventure",
    subtitle = "Learn grammar, unlock pet powers!",
    subtitleClassName = "text-[10px] font-bold uppercase tracking-widest text-slate-400",
    showIcon = true,
    showTitle = true,
    showSubtitle = true,
    showProfile = false,
    showProfileName = true,
    showProfileSecondaryText = true,
    showProfileAvatar = true,
    profileName = "Adventurer",
    profileSecondaryText = "Choose your first topic",
    profileAvatar = "",
    profileAvatarAlt = "Player avatar",
}) {
    return (
        <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-primary/10 bg-white/80 px-6 py-4 backdrop-blur-md md:px-20 md:py-6">
            <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-3">
                    {showIcon && (
                        <div className="rounded-full bg-primary p-2 text-white shadow-lg shadow-primary/30">
                            <span className="material-symbols-outlined text-2xl">pets</span>
                        </div>
                    )}
                    {(showTitle || showSubtitle) && (
                        <div className="text-left">
                            {showTitle && <h1 className="text-xl font-black tracking-tight text-primary">{title}</h1>}
                            {showSubtitle && <p className={subtitleClassName}>{subtitle}</p>}
                        </div>
                    )}
                </div>

                {showProfile && (
                    <div className="ml-auto flex items-center gap-4">
                        {(showProfileName || showProfileSecondaryText) && (
                            <div className="mr-2 hidden flex-col items-end md:flex">
                                {showProfileName && <span className="text-sm font-bold text-slate-700">{profileName}</span>}
                                {showProfileSecondaryText && <span className="text-xs font-medium text-primary">{profileSecondaryText}</span>}
                            </div>
                        )}
                        {showProfileAvatar && (
                            <div className="size-12 overflow-hidden rounded-full border-4 border-white bg-slate-200 shadow-md">
                                {profileAvatar ? (
                                    <img className="h-full w-full object-cover" src={profileAvatar} alt={profileAvatarAlt} />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-slate-500">
                                        <span className="material-symbols-outlined text-[20px]">person</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
}

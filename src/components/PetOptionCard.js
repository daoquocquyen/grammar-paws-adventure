export default function PetOptionCard({ pet, isSelected, onSelect, showLabel = false }) {
    return (
        <button
            type="button"
            aria-label={pet.name}
            aria-pressed={isSelected ? "true" : "false"}
            onClick={onSelect}
            className="pet-option group flex flex-col items-center bg-transparent text-center transition-all focus:outline-none"
        >
            <div className={`rounded-full p-[3px] transition-all ${isSelected ? "bg-primary" : "bg-transparent"}`}>
                <div className="size-[82px] rounded-full border-4 border-white bg-slate-200 flex items-center justify-center overflow-hidden shadow-md">
                    <img alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform" src={pet.image} />
                </div>
            </div>
            {showLabel && (
                <span className={`mt-1 text-[11px] font-bold leading-tight ${isSelected ? "text-slate-900" : "text-slate-600"}`}>
                    {pet.name}
                </span>
            )}
        </button>
    );
}

export default function PetOptionCard({ pet, isSelected, onSelect }) {
    return (
        <button
            type="button"
            aria-pressed={isSelected ? "true" : "false"}
            onClick={onSelect}
            className={`pet-option group relative rounded-xl border-2 transition-all text-center p-3 max-w-[150px] mx-auto ${
                isSelected ? "border-primary bg-primary/5" : "border-transparent bg-slate-50 hover:border-primary hover:bg-primary/5"
            }`}
        >
            <div className="aspect-square rounded-lg bg-white flex items-center justify-center overflow-hidden shadow-inner mb-1">
                <img alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform" src={pet.image} />
            </div>
            <span className="font-bold text-sm">{pet.name}</span>
        </button>
    );
}

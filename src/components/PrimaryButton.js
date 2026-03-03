export default function PrimaryButton({ onClick, children }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="w-full px-8 py-3.5 bg-primary text-white rounded-full font-black text-xl shadow-lg shadow-primary/25"
        >
            {children}
        </button>
    );
}

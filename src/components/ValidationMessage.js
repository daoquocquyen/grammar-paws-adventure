export default function ValidationMessage({ id, message }) {
    return (
        <p id={id} className={`mt-2 text-sm font-semibold text-rose-600 ${message ? "" : "hidden"}`} aria-live="polite">
            {message}
        </p>
    );
}

/** Hint shown when the list is empty: a curved arrow pointing up to the input field. */
export function EmptyListHint() {
  return (
    <div className="flex items-start gap-2 -mt-6 pl-6 text-gray-800 dark:text-white select-none">
      <svg
        viewBox="0 0 120 140"
        className="w-24 h-28 sm:w-28 sm:h-32 shrink-0"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M110 128 C 50 124, 18 80, 30 12" />
        <path d="M17 27 L30 12 L37 30" />
      </svg>
      <p className="pt-16 sm:pt-20 text-lg leading-relaxed">
        Votre liste est vide.
        <br />
        Ajoutez votre premier article&nbsp;!
      </p>
    </div>
  );
}

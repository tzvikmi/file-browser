// Small inline icons. Kept framework-side (they return JSX) and theme via
// currentColor so the single tokens file still drives all color.

interface IconProps {
  className?: string;
}

export function ChevronIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
    >
      <path d="m6 4 4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function FolderIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M1.5 4.5A1.5 1.5 0 0 1 3 3h3l1.5 1.5H13A1.5 1.5 0 0 1 14.5 6v5.5A1.5 1.5 0 0 1 13 13H3a1.5 1.5 0 0 1-1.5-1.5v-7Z" />
    </svg>
  );
}

export function FileIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      aria-hidden="true"
    >
      <path
        d="M4 1.5h5L12.5 5v9.5A1 1 0 0 1 11.5 15h-7a1 1 0 0 1-1-1V2.5a1 1 0 0 1 1-1Z"
        strokeLinejoin="round"
      />
      <path d="M9 1.5V5h3.5" strokeLinejoin="round" />
    </svg>
  );
}

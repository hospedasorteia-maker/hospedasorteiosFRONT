import Link from "next/link";

export default function BackToDashboard({
  className = "back-to-dashboard",
  label = "Painel",
  showIcon = true,
  children,
}) {
  return (
    <Link href="/dashboard" className={className}>
      {showIcon && (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="m12 19-7-7 7-7" />
          <path d="M19 12H5" />
        </svg>
      )}
      <span>{children ?? label}</span>
    </Link>
  );
}

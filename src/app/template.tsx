

export default function Template({ children }: { children: React.ReactNode }) {
  // No artificial delay - instant page transitions for better UX
  return <>{children}</>;
}

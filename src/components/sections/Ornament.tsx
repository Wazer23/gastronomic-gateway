export const Ornament = ({ label }: { label?: string }) => (
  <div className="flex items-center justify-center gap-6 my-8">
    <span className="h-px w-12 md:w-24 bg-primary/40" />
    {label ? (
      <span className="eyebrow whitespace-nowrap">{label}</span>
    ) : (
      <span className="text-primary text-lg">✦</span>
    )}
    <span className="h-px w-12 md:w-24 bg-primary/40" />
  </div>
);

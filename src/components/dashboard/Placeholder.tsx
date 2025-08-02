// src/components/dashboard/Placeholder.tsx
export default function Placeholder({ title }: { title: string }) {
  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-foreground">{title}</h1>
      <div className="mt-8 rounded-xl border-2 border-dashed border-secondary bg-background p-20 text-center">
        <p className="text-foreground/70">This page is under construction.</p>
      </div>
    </div>
  );
}
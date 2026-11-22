import type { FC } from "react";
import { CheckCircle2 } from "lucide-react";

export interface GoodHabitsCardProps {
  goodHabits?: string[];
}

export const GoodHabitsCard: FC<GoodHabitsCardProps> = ({ goodHabits }) => {
  if (!goodHabits || goodHabits.length === 0) return null;

  return (
    <section className="glass rounded-[28px] p-6 space-y-3">
      <h2 className="text-base font-semibold tracking-tight text-ink flex items-center gap-2">
        <CheckCircle2 className="h-4 w-4 text-teal flex-shrink-0" />
        What you are already doing well
      </h2>
      <ul className="list-inside list-disc space-y-1 text-sm text-ink/90">
        {goodHabits.map((habit, i) => (
          <li key={i}>{habit}</li>
        ))}
      </ul>
    </section>
  );
};

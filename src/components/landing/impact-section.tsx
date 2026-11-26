import type { FC } from "react";
import { m, useReducedMotion } from "framer-motion";
import { IMPACT_HEADING, IMPACT_ITEMS } from "@/constants/impact";

export const ImpactSection: FC = () => {
  const reduceMotion = useReducedMotion();

  return (
    <section className="mx-auto max-w-[1180px] px-5 py-16 sm:px-8 lg:py-24">
      <div className="mb-10 text-center sm:mb-14">
        <h2 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          {IMPACT_HEADING}
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:gap-6">
        {IMPACT_ITEMS.map((item, index) => (
          <m.article
            key={item.id}
            initial={{ opacity: 0, y: reduceMotion ? 0 : 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{
              duration: 0.5,
              delay: reduceMotion ? 0 : index * 0.08,
            }}
            className="glass-sm flex flex-col justify-between p-6 sm:p-7"
          >
            <h3 className="text-lg font-semibold tracking-tight text-ink sm:text-xl">
              {item.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-ink/80 sm:text-base">
              {item.description}
            </p>
          </m.article>
        ))}
      </div>
    </section>
  );
};

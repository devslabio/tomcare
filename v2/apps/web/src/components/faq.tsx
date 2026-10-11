import { Plus } from "lucide-react";

import type { FaqItem } from "@/lib/blocks";

export function Faq({ items }: { items: FaqItem[] }) {
  return (
    <div className="divide-y divide-line rounded-[24px] border border-line bg-white">
      {items.map((item) => (
        <details key={item.question} className="group px-6 sm:px-8 [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex items-center justify-between gap-6 py-6 text-left text-[17px] font-semibold text-ink">
            {item.question}
            <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-sand text-indigo transition duration-300 group-open:rotate-45 group-open:bg-gold group-open:text-ink">
              <Plus className="size-4" aria-hidden />
            </span>
          </summary>
          <p className="-mt-1 pb-6 pr-12 text-[15px] leading-7 text-muted">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}

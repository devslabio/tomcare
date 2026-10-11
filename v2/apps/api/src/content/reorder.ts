import type { PrismaService } from "../prisma/prisma.service";

export type Sortable = "program" | "service" | "teamMember" | "testimonial" | "partner" | "volunteerRole" | "page";

/** Persists a drag-and-drop order by rewriting sortOrder to each ID's position. */
export function reorder(prisma: PrismaService, model: Sortable, ids: string[]) {
  return prisma.$transaction(
    ids.map((id, sortOrder) =>
      // Each delegate exposes the same update signature; the union confuses TS inference.
      (prisma[model] as unknown as { update: (args: object) => Promise<unknown> }).update({
        where: { id },
        data: { sortOrder },
      }),
    ) as never,
  );
}

export async function nextSortOrder(prisma: PrismaService, model: Sortable): Promise<number> {
  const delegate = prisma[model] as unknown as {
    aggregate: (args: object) => Promise<{ _max: { sortOrder: number | null } }>;
  };
  const { _max } = await delegate.aggregate({ _max: { sortOrder: true } });
  return (_max.sortOrder ?? -1) + 1;
}

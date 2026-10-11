"use client";

import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight, Copy, Download, Printer } from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "@/components/admin/toast";
import {
  Button,
  Card,
  EmptyState,
  ErrorState,
  LoadingState,
  SearchInput,
  Select,
  useDebounced,
} from "@/components/admin/ui";
import { api, useResource, type Paged } from "@/lib/admin-api";

export type Column<T> = {
  header: string;
  /** Omit for columns that only appear in exports. */
  cell?: (row: T) => React.ReactNode;
  /** Value for Copy, CSV and Print; columns without one are left out of exports. */
  value?: (row: T) => string | number | null | undefined;
  /** API sort key; the header becomes clickable when set. */
  sort?: string;
  align?: "right";
  className?: string;
};

type SortState = { key: string; order: "asc" | "desc" };

const PAGE_SIZES = [10, 25, 50, 100];
const EXPORT_LIMIT = 20_000;

/**
 * Server-paginated admin table: page size, row numbers, search, sortable headers, numbered pages,
 * and Copy / CSV / Print of every row matching the current filters (not just the visible page).
 */
export function DataTable<T>({
  path,
  filters = {},
  columns,
  rowKey,
  title,
  searchPlaceholder = "Search",
  toolbar,
  empty,
  defaultPageSize = 10,
  version = 0,
}: {
  /** List endpoint, e.g. "/bookings". */
  path: string;
  /** Extra query parameters from the page's own filters; empty values are skipped. */
  filters?: Record<string, string | undefined>;
  columns: Column<T>[];
  rowKey: (row: T) => string | number;
  /** Used for export file names and the printout heading. */
  title: string;
  searchPlaceholder?: string;
  toolbar?: React.ReactNode;
  empty: { icon: React.ComponentType<{ className?: string }>; title: string; description?: string };
  defaultPageSize?: number;
  /** Bump to reload the current page, e.g. after editing a row. */
  version?: number;
}) {
  const toast = useToast();
  const [query, setQuery] = useState("");
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [sort, setSort] = useState<SortState | null>(null);
  const [exporting, setExporting] = useState<string | null>(null);
  const q = useDebounced(query.trim());

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) if (value) params.set(key, value);
  if (q) params.set("q", q);
  if (sort) {
    params.set("sort", sort.key);
    params.set("order", sort.order);
  }
  // Any change to filters, search, sort or page size starts again from page 1.
  const listKey = `${params}&pageSize=${pageSize}`;
  const [paging, setPaging] = useState({ key: listKey, page: 1 });
  const page = paging.key === listKey ? paging.page : 1;
  const goTo = (next: number) => setPaging({ key: listKey, page: next });

  const pageParams = new URLSearchParams(params);
  pageParams.set("page", String(page));
  pageParams.set("pageSize", String(pageSize));
  const { data, error, reload } = useResource<Paged<T>>(`${path}?${pageParams}`);
  useEffect(() => {
    if (version) reload();
  }, [version, reload]);

  const exportColumns = columns.filter((column) => column.value);
  const shownColumns = columns.filter((column) => column.cell);
  const offset = data ? (data.page - 1) * data.pageSize : 0;

  function toggleSort(key: string) {
    setSort((current) =>
      current?.key !== key ? { key, order: "asc" } : current.order === "asc" ? { key, order: "desc" } : null,
    );
  }

  async function allRows() {
    const rows: T[] = [];
    const exportParams = new URLSearchParams(params);
    exportParams.set("pageSize", "100");
    for (let next = 1; ; next++) {
      exportParams.set("page", String(next));
      const batch = await api<Paged<T>>(`${path}?${exportParams}`);
      rows.push(...batch.items);
      if (rows.length >= batch.total || !batch.items.length || rows.length >= EXPORT_LIMIT) return rows;
    }
  }

  function matrix(rows: T[]) {
    return [
      ["No", ...exportColumns.map((column) => column.header)],
      ...rows.map((row, index) => [
        String(index + 1),
        ...exportColumns.map((column) => {
          const value = column.value!(row);
          return value == null ? "" : String(value);
        }),
      ]),
    ];
  }

  async function runExport(kind: "copy" | "csv" | "print") {
    setExporting(kind);
    try {
      const rows = await allRows();
      const table = matrix(rows);
      const stamp = new Date().toISOString().slice(0, 10);
      if (kind === "copy") {
        await navigator.clipboard.writeText(
          table.map((line) => line.map((cell) => cell.replace(/\s+/g, " ")).join("\t")).join("\n"),
        );
        toast(`${rows.length} rows copied — paste them into Excel or Sheets`);
      } else if (kind === "csv") {
        const csv = table.map((line) => line.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(",")).join("\r\n");
        // The byte-order mark makes Excel read the file as UTF-8.
        const blob = new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${stamp}.csv`;
        link.click();
        URL.revokeObjectURL(link.href);
      } else {
        printTable(title, table);
      }
    } catch (exportError) {
      toast((exportError as Error).message, "error");
    } finally {
      setExporting(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        {toolbar ? <div className="flex max-w-full min-w-0 flex-wrap items-center gap-3">{toolbar}</div> : null}
        <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
          <label className="flex items-center gap-2 text-sm text-muted">
            Show
            <Select
              value={pageSize}
              onChange={(event) => setPageSize(Number(event.target.value))}
              className="w-20 py-2"
              aria-label="Rows per page"
            >
              {PAGE_SIZES.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </Select>
          </label>
          <div className="flex rounded-full border border-line bg-white p-0.5">
            <Button
              variant="ghost"
              size="sm"
              busy={exporting === "copy"}
              disabled={!data?.total}
              onClick={() => runExport("copy")}
            >
              <Copy className="size-4" aria-hidden />
              Copy
            </Button>
            <Button
              variant="ghost"
              size="sm"
              busy={exporting === "csv"}
              disabled={!data?.total}
              onClick={() => runExport("csv")}
            >
              <Download className="size-4" aria-hidden />
              CSV
            </Button>
            <Button
              variant="ghost"
              size="sm"
              busy={exporting === "print"}
              disabled={!data?.total}
              onClick={() => runExport("print")}
            >
              <Printer className="size-4" aria-hidden />
              Print
            </Button>
          </div>
          <SearchInput value={query} onChange={setQuery} placeholder={searchPlaceholder} />
        </div>
      </div>

      {error ? <ErrorState message={error} onRetry={reload} /> : null}

      <Card>
        {!data && !error ? <LoadingState /> : null}
        {data && !data.items.length ? (
          <EmptyState icon={empty.icon} title={empty.title} description={empty.description} />
        ) : null}
        {data?.items.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[48rem] text-left text-[15px]">
              <thead className="border-b border-line text-xs uppercase tracking-wider text-muted">
                <tr>
                  <th className="w-12 px-4 py-3 font-medium">No</th>
                  {shownColumns.map((column) => {
                    const active = sort && column.sort === sort.key ? sort.order : null;
                    const Icon = active === "asc" ? ArrowUp : active === "desc" ? ArrowDown : ArrowUpDown;
                    return (
                      <th
                        key={column.header}
                        className={`px-5 py-3 font-medium ${column.align === "right" ? "text-right" : ""} ${column.className ?? ""}`}
                        aria-sort={active === "asc" ? "ascending" : active === "desc" ? "descending" : undefined}
                      >
                        {column.sort ? (
                          <button
                            type="button"
                            onClick={() => toggleSort(column.sort!)}
                            className={`inline-flex items-center gap-1 uppercase tracking-wider hover:text-navy ${active ? "text-navy" : ""}`}
                          >
                            {column.header}
                            <Icon className={`size-3.5 ${active ? "" : "opacity-40"}`} aria-hidden />
                          </button>
                        ) : (
                          column.header
                        )}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {data.items.map((row, index) => (
                  <tr key={rowKey(row)} className="hover:bg-sand/60">
                    <td className="px-4 py-3.5 text-sm tabular-nums text-muted">{offset + index + 1}</td>
                    {shownColumns.map((column) => (
                      <td
                        key={column.header}
                        className={`px-5 py-3.5 ${column.align === "right" ? "text-right" : ""} ${column.className ?? ""}`}
                      >
                        {column.cell!(row)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
        {data?.total ? (
          <Pager page={data.page} pageSize={data.pageSize} total={data.total} shown={data.items.length} onPage={goTo} />
        ) : null}
      </Card>
    </div>
  );
}

function pageList(page: number, pages: number): (number | "…")[] {
  if (pages <= 7) return Array.from({ length: pages }, (_, index) => index + 1);
  const around = [page - 1, page, page + 1].filter((p) => p > 1 && p < pages);
  return [
    1,
    ...(around[0] > 2 ? ["…" as const] : []),
    ...around,
    ...(around.at(-1)! < pages - 1 ? ["…" as const] : []),
    pages,
  ];
}

function Pager({
  page,
  pageSize,
  total,
  shown,
  onPage,
}: {
  page: number;
  pageSize: number;
  total: number;
  shown: number;
  onPage: (page: number) => void;
}) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const first = (page - 1) * pageSize + 1;
  const number = new Intl.NumberFormat("en-US");
  return (
    <div className="flex flex-col gap-3 border-t border-line px-5 py-3 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
      <span>
        Showing {number.format(first)}–{number.format(first + shown - 1)} of {number.format(total)}
      </span>
      {pages > 1 ? (
        <nav className="flex items-center gap-1" aria-label="Pages">
          <Button
            variant="ghost"
            size="sm"
            disabled={page <= 1}
            onClick={() => onPage(page - 1)}
            aria-label="Previous page"
          >
            <ChevronLeft className="size-4" />
          </Button>
          {pageList(page, pages).map((item, index) =>
            item === "…" ? (
              <span key={`gap-${index}`} className="px-1.5">
                …
              </span>
            ) : (
              <button
                key={item}
                type="button"
                onClick={() => onPage(item)}
                aria-current={item === page ? "page" : undefined}
                className={`h-9 min-w-9 rounded-full px-2.5 font-semibold tabular-nums transition ${
                  item === page ? "bg-navy text-white" : "text-navy hover:bg-sand"
                }`}
              >
                {item}
              </button>
            ),
          )}
          <Button
            variant="ghost"
            size="sm"
            disabled={page >= pages}
            onClick={() => onPage(page + 1)}
            aria-label="Next page"
          >
            <ChevronRight className="size-4" />
          </Button>
        </nav>
      ) : null}
    </div>
  );
}

function printTable(title: string, table: string[][]) {
  const escape = (value: string) =>
    value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
  const [head, ...rows] = table;
  const printed = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Toronto",
  }).format(new Date());
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>${escape(title)}</title><style>
    body{font:12px system-ui,sans-serif;color:#070f1c;margin:24px}
    h1{font-size:18px;margin:0 0 4px}p{margin:0 0 16px;color:#5b6b80}
    table{border-collapse:collapse;width:100%}th,td{border:1px solid #d9dee5;padding:5px 7px;text-align:left;vertical-align:top}
    th{background:#f4f7fa}tr:nth-child(even) td{background:#fafbfc}
  </style></head><body><h1>TOMCARE Foundation — ${escape(title)}</h1><p>${rows.length} rows · printed ${escape(printed)}</p>
  <table><thead><tr>${head.map((cell) => `<th>${escape(cell)}</th>`).join("")}</tr></thead>
  <tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${escape(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table>
  </body></html>`;
  const frame = document.createElement("iframe");
  frame.style.position = "fixed";
  frame.style.width = "0";
  frame.style.height = "0";
  frame.style.border = "0";
  document.body.appendChild(frame);
  const doc = frame.contentDocument!;
  doc.open();
  doc.write(html);
  doc.close();
  frame.contentWindow!.focus();
  frame.contentWindow!.print();
  setTimeout(() => frame.remove(), 1000);
}

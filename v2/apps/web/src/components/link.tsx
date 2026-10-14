"use client";

import NextLink from "next/link";
import type { ComponentProps } from "react";

import { useI18n } from "./i18n-provider";

/** next/link that keeps visitors in their language: "/programs" becomes "/fr/programs" on the French site. */
export function Link({ href, ...props }: ComponentProps<typeof NextLink>) {
  const { href: localize } = useI18n();
  return <NextLink href={typeof href === "string" ? localize(href) : href} {...props} />;
}

export default Link;

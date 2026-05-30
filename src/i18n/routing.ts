import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";

const locales = ["en-US", "zh-CN"] as const;

export const routing = defineRouting({
  locales,
  defaultLocale: "en-US",
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);

export type Locale = (typeof locales)[number];


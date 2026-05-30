"use client";

import { Locale, usePathname, useRouter } from "@/i18n/routing";
import { Button, ButtonGroup } from "@chakra-ui/react";

const LOCALES: Locale[] = ["en-US", "zh-CN"];

export default function LanguageSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <ButtonGroup size="sm" isAttached variant="outline">
      {LOCALES.map((l) => (
        <Button
          key={l}
          onClick={() => router.replace(pathname, { locale: l })}
          aria-pressed={l === locale}
          variant={l === locale ? "solid" : "outline"}
          colorScheme={l === locale ? "brand" : "gray"}
        >
          {l === "zh-CN" ? "中文" : "EN"}
        </Button>
      ))}
    </ButtonGroup>
  );
}


"use client";

import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider } from "@chakra-ui/react";
import { PropsWithChildren, useEffect, useRef } from "react";
import theme from "./theme";

declare global {
  interface Window {
    ttq?: {
      track?: (event: string, data?: Record<string, unknown>) => void;
    };
    ttqTrackPurchase?: (data: {
      value: number;
      currency: string;
      content_id?: string;
      [key: string]: unknown;
    }) => void;
  }
}

export default function Providers({ children }: PropsWithChildren) {
  const isBlurTriggered = useRef(false);
  const lastTrackedRef = useRef<{ signature: string; time: number } | null>(null);

  useEffect(() => {
    window.ttqTrackPurchase = (data) => {
      try {
        const track = window.ttq?.track;
        if (typeof track !== "function") return;
        track("Purchase", data);
      } catch {}
    };
  }, []);

  useEffect(() => {
    const AD_CONTAINER_SELECTOR =
      "[id^='div-gpt-ad-'], .gpt-slot, .adsbygoogle, .ad-placeholder";

    const collectAdSignatureFromElement = (element: Element | null) => {
      if (!element) return null;

      const adContainer = element.closest(AD_CONTAINER_SELECTOR);
      if (!adContainer) return null;

      const slotId =
        adContainer.getAttribute("id") ??
        (adContainer.querySelector?.(
          ".gpt-slot[id], [id^='div-gpt-ad-']"
        ) as HTMLElement | null)?.getAttribute("id") ??
        null;

      const iframe =
        adContainer instanceof HTMLIFrameElement
          ? adContainer
          : (adContainer.querySelector("iframe") as HTMLIFrameElement | null);

      const googleQueryId = iframe?.getAttribute("data-google-query-id") ?? null;

      return `${slotId ?? "unknown"}:${googleQueryId ?? "unknown"}`;
    };

    const trackPurchaseIfNeeded = (sourceEvent: string, signature: string | null) => {
      if (!signature) return;

      const now = Date.now();
      if (
        lastTrackedRef.current &&
        lastTrackedRef.current.signature === signature &&
        now - lastTrackedRef.current.time < 1500
      ) {
        return;
      }

      lastTrackedRef.current = { signature, time: now };

      window.ttqTrackPurchase?.({
        value: 0.12,
        currency: "USD",
        content_id: "ad_click",
        source_event: sourceEvent,
        signature,
      });
    };

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Element | null;
      if (!target) return;
      trackPurchaseIfNeeded("pointerdown", collectAdSignatureFromElement(target));
    };

    const onBlur = () => {
      const activeElement = document.activeElement as Element | null;
      if (activeElement && activeElement.tagName === "IFRAME") {
        isBlurTriggered.current = true;
        setTimeout(() => {
          trackPurchaseIfNeeded("blur", collectAdSignatureFromElement(activeElement));
        }, 0);
        setTimeout(() => {
          isBlurTriggered.current = false;
        }, 300);
      }
    };

    const onVisibilityChange = () => {
      if (document.visibilityState !== "hidden") return;
      if (!isBlurTriggered.current) return;
      const activeElement = document.activeElement as Element | null;
      trackPurchaseIfNeeded("visibilitychange", collectAdSignatureFromElement(activeElement));
    };

    const onBeforeUnload = () => {
      const activeElement = document.activeElement as Element | null;
      trackPurchaseIfNeeded("beforeunload", collectAdSignatureFromElement(activeElement));
    };

    window.addEventListener("pointerdown", onPointerDown, true);
    window.addEventListener("blur", onBlur);
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("beforeunload", onBeforeUnload);

    return () => {
      window.removeEventListener("pointerdown", onPointerDown, true);
      window.removeEventListener("blur", onBlur);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("beforeunload", onBeforeUnload);
    };
  }, []);

  return (
    <CacheProvider>
      <ChakraProvider theme={theme}>{children}</ChakraProvider>
    </CacheProvider>
  );
}

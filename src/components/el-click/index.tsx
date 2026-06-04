"use client";

import React, { useCallback, useEffect, useRef } from "react";

// 自定义的 useEffectEvent 钩子，用于添加和移除事件监听器
function useEffectEvent(eventType: string, callback: (event: Event) => void) {
  useEffect(() => {
    window.addEventListener(eventType, callback);
    return () => {
      window.removeEventListener(eventType, callback);
    };
  }, [callback, eventType]);
}

const AD_CONTAINER_SELECTOR =
  "[id^='div-gpt-ad-'], .gpt-slot, .adsbygoogle, .ad-placeholder";

const ElClick: React.FC = () => {
  const isBlurTriggered = useRef<boolean>(false);
  const isBeforeUnloadHandled = useRef<boolean>(false);
  const lastTrackedRef = useRef<{ signature: string; time: number } | null>(null);

  const collectAdData = useCallback((element: Element | null) => {
    try {
      if (!element) return null;

      const adContainer = element.closest(AD_CONTAINER_SELECTOR);
      if (!adContainer) return null;

      const iframe =
        element instanceof HTMLIFrameElement
          ? element
          : (adContainer.querySelector("iframe") as HTMLIFrameElement | null);

      const iframeSrc = iframe?.getAttribute("src");
      if (adContainer && iframeSrc) {
        const formatIframeSrc = new URL(iframeSrc, window.location.href);
        const iframeSearchParams = new URLSearchParams(formatIframeSrc.search);
        return {
          adContainerId: adContainer.getAttribute("id"),
          googleQueryId: iframe?.getAttribute("data-google-query-id"),
          adClickTime: Date.now(),
          publisherId: iframeSearchParams.get("client"),
          adk: iframeSearchParams.get("adk"),
          adf: iframeSearchParams.get("adf"),
          slotname: iframeSearchParams.get("slotname"),
          adSize: iframeSearchParams.get("format"),
        };
      }
      return null;
    } catch (error) {
      console.error("Error collecting ad data:", error);
      return null;
    }
  }, []);

  const trackAdClick = useCallback(() => {
    const adData = collectAdData(document.activeElement);
    if (adData) {
      const signature = `${adData.adContainerId ?? "unknown"}:${adData.googleQueryId ?? "unknown"}`;
      const now = Date.now();
      if (
        lastTrackedRef.current &&
        lastTrackedRef.current.signature === signature &&
        now - lastTrackedRef.current.time < 1500
      ) {
        return;
      }
      lastTrackedRef.current = { signature, time: now };

      // window.umami.track((props) => ({
      //   ...props,
      //   name: "adClick",
      //   event: "visibilitychange",
      //   data: {
      //     ...adData,
      //   },
      // }));
      window.ttq?.track?.("ClickButton", {
        adContainerId: adData.adContainerId ?? undefined,
        googleQueryId: adData.googleQueryId ?? undefined,
        slotname: adData.slotname ?? undefined,
        adSize: adData.adSize ?? undefined,
      });
    }
  }, [collectAdData]);

  const handleBeforeUnload = useCallback(
    () => {
      if (isBeforeUnloadHandled.current) return;
      const adData = collectAdData(document.activeElement);
      if (adData) {
        // 上报数据
        // window.umami.track((props) => ({
        //   ...props,
        //   name: "adClick",
        //   event: "beforeunload",
        //   data: {
        //     ...adData,
        //   },
        // }));
        trackAdClick();
        console.log(JSON.stringify(adData));
        // 使用更简洁的方式触发像素跟踪
        isBeforeUnloadHandled.current = true;
      }
    },
    [collectAdData, trackAdClick]
  );

  const handleBlur = useCallback(() => {
    isBlurTriggered.current = true;
    setTimeout(() => {
      trackAdClick();
    }, 0);
    setTimeout(() => {
      isBlurTriggered.current = false;
    }, 300);
  }, [trackAdClick]);

  const handleVisibilityChange = useCallback(
    () => {
      if (document.visibilityState === "hidden" && isBlurTriggered.current) {
        trackAdClick();
      }
    },
    [trackAdClick]
  );

  // 使用自定义的 useEffectEvent 钩子添加事件监听器
  useEffectEvent("beforeunload", handleBeforeUnload);
  useEffectEvent("blur", handleBlur);
  useEffectEvent("visibilitychange", handleVisibilityChange);

  useEffect(() => {
    const handler = (event: PointerEvent) => {
      const target = event.target as Element | null;
      if (!target) return;
      const adData = collectAdData(target);
      if (!adData) return;

      const signature = `${adData.adContainerId ?? "unknown"}:${adData.googleQueryId ?? "unknown"}`;
      const now = Date.now();
      if (
        lastTrackedRef.current &&
        lastTrackedRef.current.signature === signature &&
        now - lastTrackedRef.current.time < 1500
      ) {
        return;
      }
      lastTrackedRef.current = { signature, time: now };

      window.ttq?.track?.("ClickButton", {
        adContainerId: adData.adContainerId ?? undefined,
        googleQueryId: adData.googleQueryId ?? undefined,
        slotname: adData.slotname ?? undefined,
        adSize: adData.adSize ?? undefined,
      });
    };

    window.addEventListener("pointerdown", handler, true);
    return () => window.removeEventListener("pointerdown", handler, true);
  }, [collectAdData]);

  return null; // This component does not render anything
};

export default ElClick;

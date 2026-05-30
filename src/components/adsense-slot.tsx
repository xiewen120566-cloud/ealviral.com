"use client";

import { useEffect, useMemo } from "react";

declare global {
  interface Window {
    googletag?: {
      cmd: Array<() => void>;
      defineSlot?: (
        adUnitPath: string,
        size: Array<[number, number]>,
        divId: string
      ) => { addService: (service: unknown) => void } | null;
      pubads?: () => {
        enableSingleRequest: () => void;
        getSlots: () => Array<{ getSlotElementId: () => string }>;
      };
      enableServices?: () => void;
      display?: (divId: string) => void;
    };
    __gptServicesEnabled?: boolean;
  }
}

type Props = {
  divId: string;
  className?: string;
  adUnitPath: string;
  sizes: Array<[number, number]>;
  minWidth?: number;
  minHeight?: number;
};

export default function AdsenseSlot({
  divId,
  className,
  adUnitPath,
  sizes,
  minWidth = 300,
  minHeight = 50,
}: Props) {
  const sizesKey = useMemo(() => JSON.stringify(sizes), [sizes]);

  useEffect(() => {
    try {
      window.googletag = window.googletag || { cmd: [] };
      const gt = window.googletag;

      gt.cmd.push(() => {
        if (!gt.pubads || !gt.defineSlot || !gt.enableServices || !gt.display) return;

        const slots = gt.pubads().getSlots();
        const exists = slots.some((slot) => slot.getSlotElementId() === divId);

        if (!exists) {
          gt.defineSlot(adUnitPath, sizes, divId)?.addService(gt.pubads());
        }

        if (!window.__gptServicesEnabled) {
          gt.pubads().enableSingleRequest();
          gt.enableServices();
          window.__gptServicesEnabled = true;
        }

        gt.display(divId);
      });
    } catch {}
  }, [divId, adUnitPath, sizesKey, sizes]);

  return (
    <div className="ad-placeholder" style={{ height: "auto !important", textAlign: "center", paddingBlock: 12 }}>
      <p>AD</p>
      <div
        id={divId}
        className={["gpt-slot", className].filter(Boolean).join(" ")}
        style={{
          minWidth,
          minHeight,
          marginInline: "auto",
        }}
      />
    </div>
  );
}


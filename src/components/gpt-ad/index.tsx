"use client";

import { Box } from "@chakra-ui/react";
import { useEffect } from "react";

declare global {
  interface GoogletagSlot {
    getSlotElementId: () => string;
  }

  interface GoogletagApi {
    cmd: Array<() => void>;
    defineSlot: (
      adUnitPath: string,
      size: Array<[number, number]>,
      divId: string
    ) => { addService: (service: unknown) => void } | null;
    pubads: () => {
      enableSingleRequest: () => void;
      getSlots: () => GoogletagSlot[];
    };
    enableServices: () => void;
    display: (divId: string) => void;
  }

  interface Window {
    googletag?: Partial<GoogletagApi> & { cmd: Array<() => void> };
    __gptServicesEnabled?: boolean;
  }
}

interface GptAdProps {
  divId: string;
  adUnitPath: string;
  sizes: Array<[number, number]>;
  minWidth?: number;
  minHeight?: number;
}

export default function GptAd({
  divId,
  adUnitPath,
  sizes,
  minWidth = 300,
  minHeight = 50,
}: GptAdProps) {
  useEffect(() => {
    window.googletag = window.googletag || { cmd: [] };
    const gt = window.googletag as Partial<GoogletagApi> & { cmd: Array<() => void> };

    gt.cmd.push(() => {
      if (!gt.pubads || !gt.defineSlot || !gt.enableServices || !gt.display) {
        return;
      }

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
  }, [divId, adUnitPath, sizes]);

  return <Box id={divId} minW={`${minWidth}px`} minH={`${minHeight}px`} />;
}

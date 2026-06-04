 

export const runtime = "edge";

import { getCategories, getGames } from "@/actions";
import { Locale } from "@/i18n/routing";
import {
  Container,
  Box,
} from "@chakra-ui/react";
import dynamic from "next/dynamic";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { randomGames } from "@/utils";
import Info from "@/components/info";
import GameItem from "@/components/game-item";
const GptAd = dynamic(() => import("@/components/gpt-ad"), { ssr: false });
interface Props {
  params: {
    locale: Locale;
  };
  searchParams: Record<string, string>;
}

export default async function Page({
  params: { locale },
  searchParams,
}: Props) {
  const baseUrlInput = (process.env.BASE_URL ?? "")
    .trim()
    .replace(/^['"]+|['"]+$/g, "");
  const baseUrl = baseUrlInput || "https://ealviral.com";
  const normalizedBaseUrl =
    baseUrl.startsWith("http://") || baseUrl.startsWith("https://")
      ? baseUrl
      : `https://${baseUrl}`;
  const { hostname } = new URL(normalizedBaseUrl);
  const allGames = await getGames(locale);
  const categories = await getCategories(locale);
  const waterfallGames = randomGames(allGames.length, Math.min(allGames.length, 120)).map(
    (item) => allGames[item]
  );
  return (
    <>
      <Header hostname={hostname} categories={categories} />
      <Container maxWidth="container.xl" px={{ base: 3, md: 4, lg: 6 }} py={{ base: 4, md: 6 }}>
        <GptAd
          divId="div-gpt-ad-1780129781656-0"
          adUnitPath="/23353070464/AD33"
          sizes={[
            [300, 31],
            [300, 100],
            [300, 600],
            [300, 50],
            [320, 100],
            [320, 480],
            [320, 50],
            [300, 75],
            [300, 250],
          ]}
          minWidth={300}
          minHeight={31}
        />
        <Box
          mt={{ base: 4, md: 6 }}
          sx={{
            columnCount: { base: 2, sm: 3, md: 4, lg: 5 },
            columnGap: { base: "12px", md: "16px", lg: "24px" },
          }}
        >
          {waterfallGames.map((item, index) => (
            <Box
              key={`${item?.id ?? "game"}-${index}`}
              mb={{ base: 3, md: 4, lg: 6 }}
              display="inline-block"
              w="full"
              sx={{ breakInside: "avoid" }}
            >
              <GameItem data={item} locale={locale} channel={searchParams?.channel} />
            </Box>
          ))}
        </Box>
        <Info locale={locale} />
        <GptAd
          divId="div-gpt-ad-1780129781656-1"
          adUnitPath="/23353070464/AD33"
          sizes={[
            [300, 31],
            [300, 100],
            [300, 600],
            [300, 50],
            [320, 100],
            [320, 480],
            [320, 50],
            [300, 75],
            [300, 250],
          ]}
          minWidth={300}
          minHeight={31}
        />
      </Container>
      <Footer />
    </>
  );
}

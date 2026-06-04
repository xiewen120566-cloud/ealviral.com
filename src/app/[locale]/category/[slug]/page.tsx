 

export const runtime = "edge";

import { getCategories, getGames } from "@/actions";
import { Locale } from "@/i18n/routing";
import {
  Container,
  VStack,
  Heading,
  Flex,
  Box,
} from "@chakra-ui/react";
import dynamic from "next/dynamic";

interface Props {
  params: {
    locale: Locale;
    slug: string;
  };
  searchParams: Record<string, string>;
}

import Header from "@/components/header";
import Footer from "@/components/footer";
import Info from "@/components/info";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import GameItem from "@/components/game-item";
import { randomGames } from "@/utils";
const GptAd = dynamic(() => import("@/components/gpt-ad"), { ssr: false });


export default async function Page({
  params: { locale, slug },
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
  const categories = await getCategories(locale);
  const allGames = await getGames(locale);
  const t = await getTranslations({ locale, namespace: "Common" });
  const category = categories.find((item) => item.alias === slug);

  if (!category) {
    return notFound();
  }

  const _list = allGames.filter(
    (item) => item.categoryId === category.id 
  );
  const waterfallGames = randomGames(_list.length, Math.min(_list.length, 120)).map(
    (item) => _list[item]
  );

  return (
    <>
      <Header categories={categories} hostname={hostname} />
      <Container maxWidth="container.xl" px={{ base: 3, md: 4, lg: 6 }} py={{ base: 4, md: 6 }}>
        <GptAd
          divId="div-gpt-ad-1780129781656-2"
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
        <VStack alignItems="stretch" gap={{ base: 4, md: 6 }} mt={{ base: 4, md: 6 }}>
          <Box
            bg="surface.1"
            border="1px solid"
            borderColor="border.subtle"
            rounded={{ base: "xl", md: "2xl" }}
            overflow="hidden"
          >
            <Box px={{ base: 4, md: 5 }} py={{ base: 4, md: 5 }}>
              <Flex alignItems="center" gap={3}>
                {/* <Image
                  alt={t("Games", { category: category.name })}
                  src={`/static/images/category/${category.alias}.png`}
                  width="48"
                  height="48"
                  priority={false}
                /> */}
                <Heading
                  fontSize={{ base: "md", md: "xl" }}
                  color="text.primary"
                  textTransform="uppercase"
                >
                  {t("Games", { category: category.name })}
                </Heading>
              </Flex>
              <Box
                pt={{ base: 3, md: 4, lg: 6 }}
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
            </Box>
          </Box>
          <Info locale={locale} />
        </VStack>
      </Container>
      <Footer />
    </>
  );
}

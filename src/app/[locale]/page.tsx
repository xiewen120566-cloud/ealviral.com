import { Locale, Link } from "@/i18n/routing";
import {
  getCategories,
  getCategoryLabel,
  getLatestFeed,
  getMostSearchedPosts,
  getTrendingPosts,
} from "@/lib/posts";
import dynamicImport from "next/dynamic";
import {
  AspectRatio,
  Box,
  Button,
  Container,
  Heading,
  HStack,
  Image,
  SimpleGrid,
  Tag,
  Text,
  VStack,
} from "@chakra-ui/react";
import { getTranslations } from "next-intl/server";

export const runtime = "edge";
export const dynamic = "force-dynamic";

const AdsenseSlot = dynamicImport(() => import("@/components/adsense-slot"), {
  ssr: false,
});

function pickRandomDistinct<T>(items: T[], count: number, key: (item: T) => string) {
  const map = new Map<string, T>();
  for (const item of items) {
    const k = key(item);
    if (!map.has(k)) map.set(k, item);
  }
  const unique = Array.from(map.values());
  for (let i = unique.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [unique[i], unique[j]] = [unique[j], unique[i]];
  }
  return unique.slice(0, Math.max(0, Math.min(count, unique.length)));
}

export default async function HomePage({
  params: { locale },
}: {
  params: { locale: Locale };
}) {
  const t = await getTranslations({ locale, namespace: "Home" });
  const publishedLabel = locale === "zh-CN" ? "发布时间" : "Published";
  const categories = getCategories(locale);
  const trending = getTrendingPosts(locale, 6);
  const mostSearched = getMostSearchedPosts(locale, 6);
  const latest = getLatestFeed(locale, 6);
  const carouselPosts = pickRandomDistinct(
    [...latest, ...trending, ...mostSearched],
    3,
    (p) => p.slug
  );

  return (
    <Container maxW="container.xl" py={{ base: 8, md: 12 }}>
      <VStack align="stretch" spacing={{ base: 6, md: 8 }}>
        <Box>
          <Heading as="h2" size={{ base: "lg", md: "xl" }} letterSpacing="tight">
            {t("title")}
          </Heading>
          <Box
            mt={4}
            border="1px solid"
            borderColor="gray.200"
            rounded={{ base: "xl", md: "2xl" }}
            overflow="hidden"
            sx={{
              "@keyframes carouselFade": {
                "0%": { opacity: 0, transform: "scale(1.02)" },
                "8%": { opacity: 1, transform: "scale(1)" },
                "33%": { opacity: 1, transform: "scale(1)" },
                "41%": { opacity: 0, transform: "scale(1.01)" },
                "100%": { opacity: 0, transform: "scale(1.02)" },
              },
            }}
          >
            <AspectRatio ratio={1200 / 420}>
              <Box position="relative">
                {carouselPosts.map((post, index) => (
                  <Box
                    key={post.slug}
                    position="absolute"
                    inset={0}
                    sx={{
                      animation: "carouselFade 12s infinite",
                      animationDelay: `${index * 4}s`,
                      animationTimingFunction: "ease-in-out",
                      willChange: "opacity, transform",
                    }}
                  >
                    <Image
                      src={post.imageUrl}
                      alt={post.title}
                      w="100%"
                      h="100%"
                      objectFit="cover"
                    />
                  </Box>
                ))}
                <Box
                  position="absolute"
                  inset={0}
                  bgGradient="linear(to-t, rgba(0,0,0,0.45), rgba(0,0,0,0))"
                />
              </Box>
            </AspectRatio>
          </Box>
          <HStack mt={4} spacing={3}>
            <Link href="/posts" locale={locale}>
              <Button as="span" colorScheme="brand">
                {t("viewAll")}
              </Button>
            </Link>
          </HStack>
        </Box>

        <AdsenseSlot
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

        <Box borderTop="1px solid" borderColor="gray.200" pt={{ base: 5, md: 6 }}>
          <Heading as="h3" size="md">
            {t("exploreBy")}
          </Heading>
          <SimpleGrid columns={{ base: 2, md: 3, lg: 5 }} spacing={4} mt={4}>
            {categories.map((c) => (
              <Link
                key={c.key}
                href={`/category/${c.key}`}
                locale={locale}
                style={{ display: "block" }}
              >
                <Box
                  border="1px solid"
                  borderColor="gray.200"
                  rounded="xl"
                  overflow="hidden"
                  _hover={{ borderColor: "gray.300" }}
                >
                  <AspectRatio ratio={3 / 2}>
                    <Image src={c.imageUrl} alt={c.label} />
                  </AspectRatio>
                  <Box p={3}>
                    <Text fontWeight="700">{c.label}</Text>
                  </Box>
                </Box>
              </Link>
            ))}
          </SimpleGrid>
        </Box>

        <Box borderTop="1px solid" borderColor="gray.200" pt={{ base: 5, md: 6 }}>
          <Heading as="h3" size="md">
            {t("trendingNow")}
          </Heading>
          <VStack align="stretch" spacing={4} mt={4}>
            {trending.map((post) => (
              <Link
                key={post.id}
                href={`/posts/${post.slug}`}
                locale={locale}
                style={{ display: "block" }}
              >
                <Box
                  p={{ base: 4, md: 5 }}
                  border="1px solid"
                  borderColor="gray.200"
                  rounded="xl"
                  _hover={{ borderColor: "gray.300" }}
                >
                  <HStack justify="space-between" align="start" gap={3}>
                    <Tag size="sm" colorScheme="gray">
                      {getCategoryLabel(locale, post.category)}
                    </Tag>
                    <Text fontSize="sm" color="gray.500">
                      {publishedLabel}: {post.date}
                    </Text>
                  </HStack>
                  <Box
                    mt={3}
                    rounded="lg"
                    overflow="hidden"
                    border="1px solid"
                    borderColor="gray.100"
                  >
                    <AspectRatio ratio={1200 / 630}>
                      <Image src={post.imageUrl} alt={post.title} />
                    </AspectRatio>
                  </Box>
                  <Heading as="h4" size="md" mt={3}>
                    {post.title}
                  </Heading>
                  <Text mt={2} color="gray.600" noOfLines={2}>
                    {post.excerpt}
                  </Text>
                </Box>
              </Link>
            ))}
          </VStack>
        </Box>

        <Box borderTop="1px solid" borderColor="gray.200" pt={{ base: 5, md: 6 }}>
          <Heading as="h3" size="md">
            {t("mostSearched")}
          </Heading>
          <VStack align="stretch" spacing={4} mt={4}>
            {mostSearched.map((post) => (
              <Link
                key={post.id}
                href={`/posts/${post.slug}`}
                locale={locale}
                style={{ display: "block" }}
              >
                <Box
                  p={{ base: 4, md: 5 }}
                  border="1px solid"
                  borderColor="gray.200"
                  rounded="xl"
                  _hover={{ borderColor: "gray.300" }}
                >
                  <HStack justify="space-between" align="start" gap={3}>
                    <Tag size="sm" colorScheme="gray">
                      {getCategoryLabel(locale, post.category)}
                    </Tag>
                    <Text fontSize="sm" color="gray.500">
                      {publishedLabel}: {post.date}
                    </Text>
                  </HStack>
                  <Box
                    mt={3}
                    rounded="lg"
                    overflow="hidden"
                    border="1px solid"
                    borderColor="gray.100"
                  >
                    <AspectRatio ratio={1200 / 630}>
                      <Image src={post.imageUrl} alt={post.title} />
                    </AspectRatio>
                  </Box>
                  <Heading as="h4" size="md" mt={3}>
                    {post.title}
                  </Heading>
                  <Text mt={2} color="gray.600" noOfLines={2}>
                    {post.excerpt}
                  </Text>
                </Box>
              </Link>
            ))}
          </VStack>
        </Box>

        <Box borderTop="1px solid" borderColor="gray.200" pt={{ base: 5, md: 6 }}>
          <Heading as="h3" size="md">
            {t("latest")}
          </Heading>
          <VStack align="stretch" spacing={4} mt={4}>
            {latest.map((post) => (
              <Link
                key={post.id}
                href={`/posts/${post.slug}`}
                locale={locale}
                style={{ display: "block" }}
              >
                <Box
                  p={{ base: 4, md: 5 }}
                  border="1px solid"
                  borderColor="gray.200"
                  rounded="xl"
                  _hover={{ borderColor: "gray.300" }}
                >
                  <HStack justify="space-between" align="start" gap={3}>
                    <Tag size="sm" colorScheme="gray">
                      {getCategoryLabel(locale, post.category)}
                    </Tag>
                    <Text fontSize="sm" color="gray.500">
                      {publishedLabel}: {post.date}
                    </Text>
                  </HStack>
                  <Box
                    mt={3}
                    rounded="lg"
                    overflow="hidden"
                    border="1px solid"
                    borderColor="gray.100"
                  >
                    <AspectRatio ratio={1200 / 630}>
                      <Image src={post.imageUrl} alt={post.title} />
                    </AspectRatio>
                  </Box>
                  <Heading as="h4" size="md" mt={3}>
                    {post.title}
                  </Heading>
                  <Text mt={2} color="gray.600" noOfLines={2}>
                    {post.excerpt}
                  </Text>
                </Box>
              </Link>
            ))}
          </VStack>
        </Box>

      </VStack>
    </Container>
  );
}


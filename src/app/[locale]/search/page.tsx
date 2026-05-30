import { Locale, Link } from "@/i18n/routing";
import { getCategoryLabel, searchPosts } from "@/lib/posts";
import {
  AspectRatio,
  Box,
  Button,
  Container,
  Heading,
  HStack,
  Image,
  Input,
  Tag,
  Text,
  VStack,
} from "@chakra-ui/react";
import { getTranslations } from "next-intl/server";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export default async function SearchPage({
  params: { locale },
  searchParams,
}: {
  params: { locale: Locale };
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const t = await getTranslations({ locale, namespace: "Pages" });
  const qParam = Array.isArray(searchParams.q) ? searchParams.q[0] : searchParams.q;
  const q = (qParam ?? "").toString();

  const results = q ? searchPosts(locale, q, 30) : [];
  const publishedLabel = locale === "zh-CN" ? "发布时间" : "Published";

  return (
    <Container maxW="container.xl" py={{ base: 8, md: 12 }}>
      <VStack align="stretch" spacing={{ base: 6, md: 8 }}>
        <Box>
          <Heading as="h2" size="lg" letterSpacing="tight">
            {t("searchTitle")}
          </Heading>
          <Text mt={2} color="gray.600">
            {t("searchSubtitle")}
          </Text>
        </Box>

        <Box as="form" method="get" action={`/${locale}/search`}>
          <HStack>
            <Input name="q" defaultValue={q} placeholder={t("searchPlaceholder")} />
            <Button type="submit" colorScheme="brand">
              {t("searchButton")}
            </Button>
          </HStack>
        </Box>

        {q ? (
          <Box>
            <Text color="gray.600">
              {t("searchResults", { count: results.length })}
            </Text>
          </Box>
        ) : null}

        <VStack align="stretch" spacing={4}>
          {results.map((post) => (
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
                <Heading as="h3" size="md" mt={3}>
                  {post.title}
                </Heading>
                <Text mt={2} color="gray.600" noOfLines={2}>
                  {post.excerpt}
                </Text>
              </Box>
            </Link>
          ))}
        </VStack>
      </VStack>
    </Container>
  );
}

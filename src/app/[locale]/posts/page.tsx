import { Locale, Link } from "@/i18n/routing";
import { getCategoryLabel, getPostsPage } from "@/lib/posts";
import {
  AspectRatio,
  Box,
  Container,
  Heading,
  HStack,
  Image,
  Tag,
  Text,
  VStack,
} from "@chakra-ui/react";
import { getTranslations } from "next-intl/server";

export const dynamic = "force-dynamic";

export default async function PostsPage({
  params: { locale },
  searchParams,
}: {
  params: { locale: Locale };
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const t = await getTranslations({ locale, namespace: "Posts" });
  const publishedLabel = locale === "zh-CN" ? "发布时间" : "Published";
  const pageParam = Array.isArray(searchParams.page) ? searchParams.page[0] : searchParams.page;
  const page = pageParam ? Number(pageParam) : 1;
  const pageSize = 20;

  const first = getPostsPage(locale, page, pageSize);
  const totalPages = Math.max(1, Math.ceil(first.total / pageSize));
  const safePage = Math.min(
    Math.max(1, Number.isFinite(page) ? Math.floor(page) : 1),
    totalPages
  );
  const { posts, total } =
    safePage === (Number.isFinite(page) ? Math.floor(page) : 1)
      ? first
      : getPostsPage(locale, safePage, pageSize);

  return (
    <Container maxW="container.xl" py={{ base: 8, md: 12 }}>
      <VStack align="stretch" spacing={{ base: 6, md: 8 }}>
        <Box>
          <Heading as="h2" size="lg" letterSpacing="tight">
            {t("title")}
          </Heading>
          <Text mt={2} color="gray.600">
            {t("subtitle")}
          </Text>
        </Box>

        <VStack align="stretch" spacing={4}>
          {posts.map((post) => (
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
                <Heading as="h3" size="md" mt={2}>
                  {post.title}
                </Heading>
                <Text mt={2} color="gray.600" noOfLines={2}>
                  {post.excerpt}
                </Text>
              </Box>
            </Link>
          ))}
        </VStack>

        <HStack justify="space-between" pt={2}>
          <Box>
            {safePage > 1 ? (
              <Link href={`/posts?page=${safePage - 1}`} locale={locale}>
                {t("prev")}
              </Link>
            ) : (
              <Text color="gray.400">{t("prev")}</Text>
            )}
          </Box>
          <Text color="gray.600">
            {t("page")} {safePage} / {totalPages}
          </Text>
          <Box>
            {safePage < totalPages ? (
              <Link href={`/posts?page=${safePage + 1}`} locale={locale}>
                {t("next")}
              </Link>
            ) : (
              <Text color="gray.400">{t("next")}</Text>
            )}
          </Box>
        </HStack>
      </VStack>
    </Container>
  );
}

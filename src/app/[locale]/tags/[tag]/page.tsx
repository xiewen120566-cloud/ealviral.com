import { Locale, Link } from "@/i18n/routing";
import { getCategoryLabel, getPostsByTagPage } from "@/lib/posts";
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
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function TagDetailPage({
  params: { locale, tag },
  searchParams,
}: {
  params: { locale: Locale; tag: string };
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const decodedTag = (() => {
    try {
      return decodeURIComponent(tag);
    } catch {
      return tag;
    }
  })();

  const pageParam = Array.isArray(searchParams.page)
    ? searchParams.page[0]
    : searchParams.page;
  const page = pageParam ? Number(pageParam) : 1;
  const pageSize = 20;

  const first = getPostsByTagPage(locale, decodedTag, page, pageSize);
  if (first.total === 0) return notFound();

  const totalPages = Math.max(1, Math.ceil(first.total / pageSize));
  const safePage = Math.min(
    Math.max(1, Number.isFinite(page) ? Math.floor(page) : 1),
    totalPages
  );
  const { posts } =
    safePage === (Number.isFinite(page) ? Math.floor(page) : 1)
      ? first
      : getPostsByTagPage(locale, decodedTag, safePage, pageSize);

  const publishedLabel = locale === "zh-CN" ? "发布时间" : "Published";

  return (
    <Container maxW="container.xl" py={{ base: 8, md: 12 }}>
      <VStack align="stretch" spacing={{ base: 6, md: 8 }}>
        <Box>
          <Heading as="h2" size="lg" letterSpacing="tight">
            {decodedTag}
          </Heading>
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

        <HStack justify="space-between" pt={2}>
          <Box>
            {safePage > 1 ? (
              <Link
                href={`/tags/${encodeURIComponent(decodedTag)}?page=${safePage - 1}`}
                locale={locale}
              >
                {locale === "zh-CN" ? "上一页" : "Previous"}
              </Link>
            ) : (
              <Text color="gray.400">{locale === "zh-CN" ? "上一页" : "Previous"}</Text>
            )}
          </Box>
          <Text color="gray.600">
            {(locale === "zh-CN" ? "页码" : "Page")} {safePage} / {totalPages}
          </Text>
          <Box>
            {safePage < totalPages ? (
              <Link
                href={`/tags/${encodeURIComponent(decodedTag)}?page=${safePage + 1}`}
                locale={locale}
              >
                {locale === "zh-CN" ? "下一页" : "Next"}
              </Link>
            ) : (
              <Text color="gray.400">{locale === "zh-CN" ? "下一页" : "Next"}</Text>
            )}
          </Box>
        </HStack>
      </VStack>
    </Container>
  );
}


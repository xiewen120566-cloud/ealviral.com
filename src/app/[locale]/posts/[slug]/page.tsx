import { Locale, Link } from "@/i18n/routing";
import { getCategoryLabel, getPostBySlug } from "@/lib/posts";
import dynamicImport from "next/dynamic";
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
import { getTranslations } from "next-intl/server";

export const runtime = "edge";
export const dynamic = "force-dynamic";

const AdsenseSlot = dynamicImport(() => import("@/components/adsense-slot"), {
  ssr: false,
});

export default async function PostDetailPage({
  params: { locale, slug },
}: {
  params: { locale: Locale; slug: string };
}) {
  const t = await getTranslations({ locale, namespace: "Post" });
  const post = getPostBySlug(locale, slug);
  if (!post) return notFound();
  const publishedLabel = locale === "zh-CN" ? "发布时间" : "Published";

  return (
    <Container maxW="container.lg" py={{ base: 8, md: 12 }}>
      <VStack align="stretch" spacing={{ base: 6, md: 8 }}>
        <AdsenseSlot
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
        <Box>
          <Heading as="h2" size={{ base: "lg", md: "xl" }} mt={2} letterSpacing="tight">
            {post.title}
          </Heading>
          <HStack spacing={2} mt={4} wrap="wrap">
            <Tag size="sm" colorScheme="gray">
              {getCategoryLabel(locale, post.category)}
            </Tag>
            {post.tags.map((tag) => (
              <Tag key={tag} size="sm" colorScheme="gray">
                {tag}
              </Tag>
            ))}
          </HStack>
        </Box>

        <Box rounded="xl" overflow="hidden" border="1px solid" borderColor="gray.200">
          <AspectRatio ratio={1200 / 630}>
            <Image src={post.imageUrl} alt={post.title} />
          </AspectRatio>
        </Box>

        <Box border="1px solid" borderColor="gray.200" rounded="xl" p={{ base: 4, md: 6 }}>
          <Heading as="h3" size="md">
            {t("content")}
          </Heading>
          <Text mt={4} color="gray.700" whiteSpace="pre-line">
            {post.content}
          </Text>
          <Box mt={6}>
            <Text textAlign="right" fontSize="sm" color="gray.500">
              {publishedLabel}: {post.date}
            </Text>
          </Box>
        </Box>

        <Box>
          <Link href="/posts" locale={locale}>
            {t("back")}
          </Link>
        </Box>

      </VStack>
    </Container>
  );
}

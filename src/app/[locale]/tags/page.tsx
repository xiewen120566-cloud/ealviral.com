import { Locale, Link } from "@/i18n/routing";
import { getTagCounts } from "@/lib/posts";
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Tag,
  Text,
  VStack,
} from "@chakra-ui/react";
import { getTranslations } from "next-intl/server";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export default async function TagsPage({
  params: { locale },
}: {
  params: { locale: Locale };
}) {
  const t = await getTranslations({ locale, namespace: "Pages" });
  const tags = getTagCounts(locale).slice(0, 40);

  return (
    <Container maxW="container.xl" py={{ base: 8, md: 12 }}>
      <VStack align="stretch" spacing={{ base: 6, md: 8 }}>
        <Box>
          <Heading as="h2" size="lg" letterSpacing="tight">
            {t("tagsTitle")}
          </Heading>
          <Text mt={2} color="gray.600">
            {t("tagsSubtitle")}
          </Text>
        </Box>

        <SimpleGrid columns={{ base: 2, md: 3, lg: 5 }} spacing={3}>
          {tags.map((item) => (
            <Link
              key={item.tag}
              href={`/tags/${encodeURIComponent(item.tag)}`}
              locale={locale}
              style={{ display: "block" }}
            >
              <Tag size="lg" variant="subtle" colorScheme="gray" justifyContent="space-between">
                <Text fontWeight="700">{item.tag}</Text>
                <Text color="gray.600">{item.count}</Text>
              </Tag>
            </Link>
          ))}
        </SimpleGrid>
      </VStack>
    </Container>
  );
}

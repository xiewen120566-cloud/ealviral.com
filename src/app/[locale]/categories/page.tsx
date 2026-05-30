import { Locale, Link } from "@/i18n/routing";
import { getCategoryCounts } from "@/lib/posts";
import {
  AspectRatio,
  Box,
  Container,
  Heading,
  Image,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import { getTranslations } from "next-intl/server";

export const dynamic = "force-dynamic";

export default async function CategoriesPage({
  params: { locale },
}: {
  params: { locale: Locale };
}) {
  const t = await getTranslations({ locale, namespace: "Pages" });
  const categories = getCategoryCounts(locale);

  return (
    <Container maxW="container.xl" py={{ base: 8, md: 12 }}>
      <VStack align="stretch" spacing={{ base: 6, md: 8 }}>
        <Box>
          <Heading as="h2" size="lg" letterSpacing="tight">
            {t("categoriesTitle")}
          </Heading>
          <Text mt={2} color="gray.600">
            {t("categoriesSubtitle")}
          </Text>
        </Box>

        <SimpleGrid columns={{ base: 2, md: 3, lg: 5 }} spacing={4}>
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
                  <Text fontSize="sm" color="gray.600" mt={1}>
                    {t("postsCount", { count: c.count })}
                  </Text>
                </Box>
              </Box>
            </Link>
          ))}
        </SimpleGrid>
      </VStack>
    </Container>
  );
}


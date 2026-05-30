import { Locale } from "@/i18n/routing";
import { Box, Container, Heading, Text, VStack } from "@chakra-ui/react";
import { getTranslations } from "next-intl/server";

export const dynamic = "force-dynamic";

export default async function PrivacyPage({
  params: { locale },
}: {
  params: { locale: Locale };
}) {
  const t = await getTranslations({ locale, namespace: "Pages" });

  return (
    <Container maxW="container.md" py={{ base: 8, md: 12 }}>
      <VStack align="stretch" spacing={{ base: 5, md: 6 }}>
        <Box>
          <Heading as="h2" size="lg" letterSpacing="tight">
            {t("privacyTitle")}
          </Heading>
          <Text mt={2} color="gray.600">
            {t("privacySubtitle")}
          </Text>
        </Box>
        <Box border="1px solid" borderColor="gray.200" rounded="xl" p={{ base: 4, md: 6 }}>
          <Text whiteSpace="pre-line" color="gray.700">
            {t("privacyBody")}
          </Text>
        </Box>
      </VStack>
    </Container>
  );
}


import { Locale, Link } from "@/i18n/routing";
import { Box, Container, Flex, Text } from "@chakra-ui/react";
import { getTranslations } from "next-intl/server";

export default async function Footer({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "Footer" });

  return (
    <Box borderTop="1px solid" borderColor="gray.200" bg="white" mt={12}>
      <Container maxW="container.xl" py={8}>
        <Flex justify="space-between" align="center" gap={6} wrap="wrap">
          <Text fontSize="sm" color="gray.600">
            {t("copyright")}
          </Text>
          <Flex gap={4} wrap="wrap">
            <Text fontSize="sm" color="gray.600">
              <Link href="/about" locale={locale}>
                {t("about")}
              </Link>
            </Text>
            <Text fontSize="sm" color="gray.600">
              <Link href="/contact" locale={locale}>
                {t("contact")}
              </Link>
            </Text>
            <Text fontSize="sm" color="gray.600">
              <Link href="/privacy" locale={locale}>
                {t("privacy")}
              </Link>
            </Text>
            <Text fontSize="sm" color="gray.600">
              <Link href="/terms" locale={locale}>
                {t("terms")}
              </Link>
            </Text>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
}

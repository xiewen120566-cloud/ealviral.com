"use client";

import { Locale, Link } from "@/i18n/routing";
import {
  Box,
  Button,
  Container,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Heading,
  HStack,
  IconButton,
  Spacer,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "./language-switcher";

export default function Header({ locale }: { locale: Locale }) {
  const t = useTranslations("Nav");
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box borderBottom="1px solid" borderColor="gray.200" bg="white">
      <Container maxW="container.xl" py={4}>
        <Flex align="center" gap={3}>
          <IconButton
            display={{ base: "inline-flex", md: "none" }}
            aria-label="Menu"
            onClick={onOpen}
            variant="outline"
            icon={<Text fontSize="xl">≡</Text>}
          />
          <Heading as="h1" size="md" letterSpacing="tight">
            <Link href="/" locale={locale}>
              {t("brand")}
            </Link>
          </Heading>
          <HStack display={{ base: "none", md: "flex" }} spacing={4} fontWeight="600">
            <Link href="/" locale={locale}>
              {t("home")}
            </Link>
            <Link href="/posts" locale={locale}>
              {t("posts")}
            </Link>
            <Link href="/categories" locale={locale}>
              {t("categories")}
            </Link>
            <Link href="/tags" locale={locale}>
              {t("tags")}
            </Link>
            <Link href="/search" locale={locale}>
              {t("search")}
            </Link>
          </HStack>
          <Spacer />
          <Box display={{ base: "none", md: "block" }}>
            <LanguageSwitcher locale={locale} />
          </Box>
        </Flex>
      </Container>

      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">{t("brand")}</DrawerHeader>
          <DrawerBody>
            <VStack align="stretch" spacing={3} pt={2}>
              <Box onClick={onClose}>
                <Link href="/" locale={locale}>
                  <Button as="span" variant="ghost" justifyContent="flex-start" w="full">
                    {t("home")}
                  </Button>
                </Link>
              </Box>
              <Box onClick={onClose}>
                <Link href="/posts" locale={locale}>
                  <Button as="span" variant="ghost" justifyContent="flex-start" w="full">
                    {t("posts")}
                  </Button>
                </Link>
              </Box>
              <Box onClick={onClose}>
                <Link href="/categories" locale={locale}>
                  <Button as="span" variant="ghost" justifyContent="flex-start" w="full">
                    {t("categories")}
                  </Button>
                </Link>
              </Box>
              <Box onClick={onClose}>
                <Link href="/tags" locale={locale}>
                  <Button as="span" variant="ghost" justifyContent="flex-start" w="full">
                    {t("tags")}
                  </Button>
                </Link>
              </Box>
              <Box onClick={onClose}>
                <Link href="/search" locale={locale}>
                  <Button as="span" variant="ghost" justifyContent="flex-start" w="full">
                    {t("search")}
                  </Button>
                </Link>
              </Box>
              <Box onClick={onClose}>
                <Link href="/about" locale={locale}>
                  <Button as="span" variant="ghost" justifyContent="flex-start" w="full">
                    {t("about")}
                  </Button>
                </Link>
              </Box>
              <Box onClick={onClose}>
                <Link href="/contact" locale={locale}>
                  <Button as="span" variant="ghost" justifyContent="flex-start" w="full">
                    {t("contact")}
                  </Button>
                </Link>
              </Box>
              <Box onClick={onClose}>
                <Link href="/privacy" locale={locale}>
                  <Button as="span" variant="ghost" justifyContent="flex-start" w="full">
                    {t("privacy")}
                  </Button>
                </Link>
              </Box>
              <Box onClick={onClose}>
                <Link href="/terms" locale={locale}>
                  <Button as="span" variant="ghost" justifyContent="flex-start" w="full">
                    {t("terms")}
                  </Button>
                </Link>
              </Box>
              <Box pt={2}>
                <LanguageSwitcher locale={locale} />
              </Box>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}

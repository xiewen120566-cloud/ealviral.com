import { Box, Container, Heading, Text } from "@chakra-ui/react";

export default function NotFound() {
  return (
    <Container maxW="container.md" py={16}>
      <Box>
        <Heading size="lg">404</Heading>
        <Text mt={3} color="gray.600">
          Not Found
        </Text>
      </Box>
    </Container>
  );
}


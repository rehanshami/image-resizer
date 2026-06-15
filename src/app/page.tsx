import { Container } from "@/components/common/Container";
import { Stack } from "@/components/common/Stack";
import { Title } from "@/components/common/Title";

import FramerDashboard from "@/components/framer/FramerDashboard";

export default function HomePage() {
  return (
    <Container as="main">
      <Stack $spacing="xl" $align="center">
        <Title $size="large" $color="primary">
          Image framer
        </Title>

        <FramerDashboard />
      </Stack>
    </Container>
  );
}

"use client";

import styled from "styled-components";

type TitleSize = "small" | "medium" | "large";

type TitleTone = "default" | "brand" | "inverse" | "muted";

type TitleProps = {
  $size?: TitleSize;
  $tone?: TitleTone;
};

const TITLE_SIZES: Record<TitleSize, string> = {
  small: "1.5rem",
  medium: "2rem",
  large: "2.75rem",
};

export const Title = styled.h1<TitleProps>`
  margin: 0;

  font-family: inherit;

  font-weight: 700;

  line-height: 1.1;

  letter-spacing: -0.03em;

  font-size: ${({ $size = "medium" }) => TITLE_SIZES[$size]};

  color: ${({ $tone = "default", theme }) => {
    switch ($tone) {
      case "brand":
        return theme.colors.brand.primary;

      case "inverse":
        return theme.colors.text.inverse;

      case "muted":
        return theme.colors.text.secondary;

      default:
        return theme.colors.text.primary;
    }
  }};
`;

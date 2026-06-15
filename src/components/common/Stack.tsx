"use client";
import styled from "styled-components";

type StackSpacing = "none" | "sm" | "md" | "lg" | "xl";

type StackAlign = "start" | "center" | "end" | "stretch";

type StackJustify = "start" | "center" | "end" | "space-between";

type StackDirection = "row" | "column";

type StackProps = {
  $spacing?: StackSpacing;
  $align?: StackAlign;
  $justify?: StackJustify;
  $direction?: StackDirection;
  $fullWidth?: boolean;
};

const alignMap = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  stretch: "stretch",
};

const justifyMap = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  "space-between": "space-between",
};

export const Stack = styled.div<StackProps>`
  display: flex;
  flex-direction: ${({ $direction = "column" }) => $direction};

  /* Intercept "none" to output 0 layout gap and safely satisfy theme index definitions */
  gap: ${({ theme, $spacing = "md" }) =>
    $spacing === "none" ? "0" : theme.spacing[$spacing]};

  align-items: ${({ $align = "stretch" }) => alignMap[$align]};

  justify-content: ${({ $justify = "start" }) => justifyMap[$justify]};

  width: ${({ $fullWidth }) => ($fullWidth ? "100%" : "auto")};
`;

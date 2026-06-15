"use client";
import styled, { css } from "styled-components";

type ContainerProps = {
  $fluid?: boolean;
  $centerContent?: boolean;
};

export const Container = styled.div<ContainerProps>`
  width: 100%;
  max-width: ${({ $fluid }) => ($fluid ? "100%" : "1200px")};
  margin-top: ${({ theme }) => theme.spacing.lg};
  margin-left: auto;
  margin-right: auto;
  padding-left: ${({ theme }) => theme.spacing.md};
  padding-right: ${({ theme }) => theme.spacing.md};
  ${({ $centerContent }) =>
    $centerContent &&
    css`
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
    `}
`;

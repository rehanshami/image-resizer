"use client";

import styled, { css, RuleSet } from "styled-components";
import { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  $variant?: ButtonVariant;
};

const VARIANT_STYLES: Record<ButtonVariant, RuleSet> = {
  primary: css`
    background: linear-gradient(
      180deg,
      ${({ theme }) => theme.colors.brand.primary} 0%,
      ${({ theme }) => theme.colors.brand.primaryHover} 100%
    );

    color: ${({ theme }) => theme.colors.text.inverse};

    border: 1px solid transparent;

    box-shadow: ${({ theme }) => theme.shadows.sm};
  `,

  secondary: css`
    background: ${({ theme }) => theme.colors.surface.elevated};

    color: ${({ theme }) => theme.colors.text.primary};

    border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  `,
};

export const Button = styled.button<ButtonProps>`
  display: inline-flex;

  align-items: center;

  justify-content: center;

  width: 100%;

  min-height: 48px;

  border-radius: ${({ theme }) => theme.borderRadius.md};

  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};

  font-size: ${({ theme }) => theme.typography.fontSizes.md};

  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};

  line-height: 1;

  cursor: pointer;

  transition:
    transform 180ms ease,
    box-shadow 180ms ease,
    background 180ms ease,
    border-color 180ms ease;

  ${({ $variant = "primary" }) => VARIANT_STYLES[$variant]}

  &:hover:not(:disabled) {
    transform: translateY(-1px);

    box-shadow: ${({ theme }) => theme.shadows.md};
  }

  &:active:not(:disabled) {
    transform: translateY(1px);
  }

  &:focus-visible {
    outline: 3px solid rgba(37, 99, 235, 0.35);

    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.5;

    cursor: not-allowed;
  }
`;

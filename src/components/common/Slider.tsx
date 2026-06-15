"use client";

import { InputHTMLAttributes } from "react";

import styled from "styled-components";

type SliderProps = InputHTMLAttributes<HTMLInputElement>;

const StyledSlider = styled.input`
  width: 100%;

  cursor: pointer;

  accent-color: ${({ theme }) => theme.colors.brand.primary};
`;

export function Slider(props: SliderProps) {
  return <StyledSlider type="range" {...props} />;
}

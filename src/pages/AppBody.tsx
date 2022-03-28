import React from 'react'
import styled from 'styled-components'
import { transparentize } from 'polished'

export const BodyWrapper = styled.div`
  position: relative;
  max-width: 428px;
  width: 100%;
  background: ${({ theme }) => transparentize(0, theme.bg1)};
  border-radius: 10px;
  /* padding: 1rem; */
`

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export default function AppBody({ children }: { children: React.ReactNode }) {
  return <BodyWrapper>{children}</BodyWrapper>
}

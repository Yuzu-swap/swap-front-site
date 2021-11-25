import React, { useRef, useState } from 'react'
import { BookOpen, Code, Info, MessageCircle, PieChart, Tool } from 'react-feather'
import styled from 'styled-components'
import { ReactComponent as MenuIcon } from '../../assets/images/menu.svg'
import { useActiveWeb3React } from '../../hooks'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'
import { ApplicationModal } from '../../state/application/actions'
import { useModalOpen, useToggleModal } from '../../state/application/hooks'
import i18n from 'i18n'

import { ExternalLink, StyledInternalLink } from '../../theme'
import { ButtonPrimary } from '../Button'

const StyledMenuIcon = styled(MenuIcon)`
  path {
    stroke: ${({ theme }) => theme.text1};
  }
`

const StyledLanguageButton = styled.button`
${({ theme }) => theme.mediaWidth.upToMedium`
padding: 1rem 0 1rem 1rem;
justify-content: flex-end;
`};
`

const StyledMenu = styled.div`
  margin-left: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border: none;
  text-align: left;

  ${({ theme }) => theme.mediaWidth.upToExtra2Small`
    margin-left: 0.2rem;
  `};
`

const MenuFlyout = styled.span`
  border-radius: ${({ theme }) => theme.borderRadius};
  ${({ theme }) => theme.mediaWidth.upToMedium`
    top: -8rem !important;
    :after{
      border-color: #fff transparent transparent transparent !important;
      top: 70px !important;
    }
  `};
`

const MenuItem = styled(ExternalLink)`
  flex: 1;
  padding: 0.5rem 0.2rem;
  color: ${({ theme }) => theme.text1};
  :hover {
    color: ${({ theme }) => theme.text1};
    cursor: pointer;
    text-decoration: none;
    opacity:0.8;
  }
  > svg {
    margin-right: 8px;
  }
`

const MenuItemInternal = styled(StyledInternalLink)`
  flex: 1;
  padding: 0.5rem 0.5rem;
  color: ${({ theme }) => theme.text1};
  :hover {
    color: ${({ theme }) => theme.text1};
    cursor: pointer;
    text-decoration: none;
    opacity:0.8;
  }
  > svg {
    margin-right: 8px;
  }
`

export default function Language() {
  const { account } = useActiveWeb3React()

  const node = useRef<HTMLDivElement>()
  const open = useModalOpen(ApplicationModal.LANGUAGE)
  const toggle = useToggleModal(ApplicationModal.LANGUAGE)
  useOnClickOutside(node, open ? toggle : undefined)
  const openClaimModal = useToggleModal(ApplicationModal.ADDRESS_CLAIM)

  let LANGUAGES= {
    ZH_CN: {name: '简体中文', key: 'zh-CN'},
    EN_US: {name: 'English', key: 'en-US'}
  };
  let LANGUGAGE_STORAGE_NAME = 'zooswap_language_name'
  let currentLanguage = localStorage.getItem(LANGUGAGE_STORAGE_NAME) || LANGUAGES.EN_US.name;
  let [languageLabel, setLanguageLabel] = useState(currentLanguage)

  function setStorage(language: any){
    setLanguageLabel(language.name)
    localStorage.setItem(LANGUGAGE_STORAGE_NAME, language.name);
    i18n.changeLanguage(language.key);
  }
  function onChinese(){
    setStorage(LANGUAGES.ZH_CN);
  }
  function onEnglish(){
    setStorage(LANGUAGES.EN_US);
  }
  return (
    // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/30451
    <StyledMenu ref={node as any}>
      <button className="s-top-links-btn s-top-link-language" onClick={toggle} >{languageLabel}</button>

      {open && (
        <MenuFlyout className="s-top-links">
          {/*<button className="s-top-link-button" onClick={onChinese}>
            <span>简体中文</span>
      </button>*/}
          <button className="s-top-link-button" onClick={onEnglish}>
            <span>English</span>
          </button>
        </MenuFlyout>
      )}
    </StyledMenu>
  )
}

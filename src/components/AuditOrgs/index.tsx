import React from 'react'
import styled from 'styled-components'
import { CardProps, Text } from 'rebass'
import QuestionHelper from '../QuestionHelper'
import { Box } from 'rebass/styled-components'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import org0 from '../../assets/newUI/WechatIMG673.jpeg'
import org1 from '../../assets/newUI/fairproof.png'
import org2 from '../../assets/newUI/slowmist.png'

export default function AuditOrgs(props: any) {
  const { t } = useTranslation();
  /*新部署环境需要配置 Nginx 访问 PDF 文件*/
  let url = '/PeckShield-Audit-Report-YuzuSwap-v1.0_final.pdf';
  return (
    <div className="s-audit-orgs">
      <h2>{t('auditOrgName')}</h2>
      <p style={{color: '#FF0000'}}>This protocol is in beta, please use at your own risk.</p>
      <a href={url} target='_blank'>
        <img src={org0} />
        {/*
        <img src={org1} />
        <img src={org2} />*/
        }
      </a>
    </div>
  )
}

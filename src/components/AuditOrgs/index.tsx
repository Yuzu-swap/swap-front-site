import React from 'react'
import styled from 'styled-components'
import { CardProps, Text } from 'rebass'
import QuestionHelper from '../QuestionHelper'
import { Box } from 'rebass/styled-components'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import org0 from '../../assets/newUI/WechatIMG673.jpeg'
import org1 from '../../assets/newUI/Verilog.png'
import org2 from '../../assets/newUI/slowmist.png'
import titleL from '../../assets/newUI/titleLeft.png'
import titleR from '../../assets/newUI/titleRight.png'




export function TitleShow({str}:{str : string}){
  const Tt = styled.div`
    margin-top: 20px;
    font-size: 30px;
    font-weight: bold;
    color: #FFFFFF;
    height: 35px;
    line-height: 35px;
    width: 100%;
    text-align: center;
  `
  return(
    <Tt>
      <img src={titleL} height={"10px"} style={{verticalAlign:'middle'}}/>
      {" " + str + " "}
      <img src={titleR} height={"10px"} style={{verticalAlign:'middle'}}/>
    </Tt>
  )

}

export default function AuditOrgs(props: any) {
  const { t } = useTranslation();
  /*新部署环境需要配置 Nginx 访问 PDF 文件*/
  let url = '/PeckShield-Audit-Report-YuzuSwap-v1.0_final.pdf';
  return (
    <div className="s-audit-orgs">
      <TitleShow str={t('auditOrgName')}/>
      <p style={{color: '#FF0000'}}>This protocol is in beta, please use at your own risk.</p>
      <a href={url} target='_blank'>
        <img src={org0} />
      </a>
      <a href={'https://hackmd.io/@verilog/yuzuswap'} target='_blank'>
        <img src={org1} style={{background: '#FFF'}} />
      </a>
    </div>
  )
}

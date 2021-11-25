import React, { useState } from 'react'
import styled from 'styled-components'
import { CardProps, Text } from 'rebass'
import QuestionHelper from '../QuestionHelper'
import { Box } from 'rebass/styled-components'
import { useTranslation } from 'react-i18next'

export default function Notice() {
  const { t } = useTranslation()
  const list = [
    {
      title: 'ZooSwap第二轮有奖公测正式启动，瓜分10万枚ZOO',
      link: 'https://www.yuque.com/docs/share/4cfd6b26-d323-4384-ae7b-201ab70cd2a2?#',
      time: '2021-04-30'
    },
    {
      title: '关于ZooSwap系统迭代公告',
      link: 'https://www.yuque.com/docs/share/4db7d7ab-50f0-4e76-9d26-a71d115fd0eb?# ',
      time: '2021-04-29'
    },
    {
      title: 'ZooSwap项目介绍',
      link: 'https://www.yuque.com/docs/share/b401d283-386c-4bee-b18a-3f14a894fb26',
      time: '2021-04-01'
    },
    {
      title: 'ZooSwap社区志愿者招募',
      link: 'https://www.yuque.com/docs/share/dcfa09d4-186e-4c43-9318-3d541c0afcf3',
      time: '2021-04-01'
    }, {
      title: 'ZooSwap&OKExChain公测有奖空投',
      link: 'https://www.yuque.com/docs/share/4cfd6b26-d323-4384-ae7b-201ab70cd2a2',
      time: '2021-04-01'
    }, {
      title: 'BitKeep使用教程',
      link: 'https://www.yuque.com/docs/share/4dc1397d-7700-40c7-9cc8-02bba7df8dea',
      time: '2021-04-01'
    }, {
      title: 'MetaMask使用教程',
      link: 'https://www.yuque.com/docs/share/9dd1a9d8-f424-4280-965e-8377e5cdee12',
      time: '2021-04-01'
    }
  ];
  return (
    <div className="s-notice-index">
      <div className="s-notice-title">
        <h2>{t('notice')}</h2>
        <a target="_blank" href="https://www.yuque.com/books/share/ec317e78-518c-4d00-90c5-a7193055cc8b?#%20%E3%80%8AZooSwap%20Wiki%E3%80%8B" className="s-notice-more">{t('more')}</a>
      </div>
      {list.map((news: any, i: number) => {
        return (<div className="s-notice-item" key={i}>
          <a target="_blank" href={news.link}>{news.title}</a>
          <span>{news.time}</span>
        </div>)
      })}
    </div>
  )
}

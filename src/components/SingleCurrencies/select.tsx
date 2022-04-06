import React, { useState, useMemo } from 'react'
import { Settings, X } from 'react-feather'
import styled from 'styled-components'
import { CardProps, Text } from 'rebass'
import QuestionHelper from '../QuestionHelper'
import { Box } from 'rebass/styled-components'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import ZooSwapLogo from '../../assets/images/zooswap-logo.png'
import Sloganer from 'components/Sloganer'
import LoadingRings from 'components/Loader/rings'
import BoardroomLP from './lp'

import { AutoColumn } from '../Column'
import Modal from '../Modal'
import { RowBetween, RowFixed } from '../Row'
import Toggle from '../Toggle'
import { ButtonPrimary, ButtonPrimaryNormal, ButtonGray } from '../Button'
import { useSelector } from 'react-redux'
import { ChainId, CurrencyAmount, JSBI, Token, TokenAmount, StakePool } from '@liuxingfeiyu/zoo-sdk'
import { AppState } from 'state'
import { DefaultChainId, ZOO_PARK_ADDRESS } from '../../constants'
import { useActiveWeb3React } from 'hooks'
import { useApproveCallback, ApprovalState } from 'hooks/useApproveCallback'
import { useStakingContract } from 'hooks/useContract'
import useTransactionDeadline from 'hooks/useTransactionDeadline'
import useZooParkCallback from 'zooswap-hooks/useZooPark'
import { tokenAmountForshow, numberToString } from 'utils/ZoosSwap'
import { useMyAllStakePoolList } from 'data/ZooPark'
import { useTranslation } from 'react-i18next'
import { isTransactionRecent, useAllTransactions } from '../../state/transactions/hooks'
import { TransactionDetails } from '../../state/transactions/reducer'

const StyledCloseIcon = styled(X)`
  height: 20px;
  width: 20px;
  :hover {
    cursor: pointer;
  }

  > * {
    stroke: ${({ theme }) => theme.text1};
  }
`
const ModalContentWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.2rem 0;
  background-color: ${({ theme }) => theme.bg2};
  border-radius: 8px;
  width: 100%;
`

export default function SingleCurrencySelected(props: RouteComponentProps<{ pid: string }>) {
  const {
    location: { search },
    match: {
      params: { pid }
    }
  } = props
  const pindex = parseInt(pid)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [pledgeValue, setPledgeValue] = useState('0')
  const [isHarvest, setHarvest] = useState(false) //提现对话框
  const [isApprove, setApprove] = useState(false)
  const [status, setStatus] = useState({ type: 'init', tips: '' })

  const [poolList, statics] = useMyAllStakePoolList()

  const { t } = useTranslation();
  // tododo：页面刷新时无数据来源
  const pool = poolList[pindex]

  const ZERO = JSBI.BigInt(0)
  // 个人质押总额
  const myStaked = pool ? tokenAmountForshow(pool.myCurrentLp) : ZERO
  // 个人未领取奖励
  const myReward = pool ? tokenAmountForshow(pool.myReward) : ZERO
  // 个人lp 余额
  const myLpBalance = pool ? numberToString(JSBI.toNumber(pool.myLpBalance) / 1e18) : ZERO

  const poolId = pool && pool.pid


  const { chainId, account } = useActiveWeb3React()

  function newTransactionsFirst(a: TransactionDetails, b: TransactionDetails) {
    return b.addedTime - a.addedTime
  }
  // 是否已授权 ，授权操作函数
  const [approval, approveCallback] = useApproveCallback(pool ? new TokenAmount(new Token(chainId ?? DefaultChainId, pool.lpAddress, 18,"YuzuSwap LP Token"), pool.myLpBalance) : undefined, ZOO_PARK_ADDRESS[chainId ?? DefaultChainId])
  // 质押和解除质押函数 ， 提取奖励操作使用解除质押来实现（amount参数为0)
  const { deposit, withdraw } = useZooParkCallback()

  const allTransactions = useAllTransactions()
  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
  }, [allTransactions])
  const pending = sortedRecentTransactions.filter(tx => !tx.receipt).map(tx => tx.hash)
  const hasPendingTransactions = !!pending.length


  const onHarvest = async () => {
  }
  const onWithdraw = async () => {
    try {
      await withdraw(poolId, pool.myCurrentLp.toString(10), () => {
        let data = {
          type: 'success',
          tips: t('operateSuccess')
        };
        // setStatus(data);
      })
    } catch (err) {
      console.log("withdraw err is ", err)
      let data = {
        type: 'failed',
        tips: t('operateFailed')
      };
      setStatus(data);
    }
  }
  const onDeposit = async () => {
    try {
      const amount = pledgeValue.indexOf(".") == -1 ? JSBI.multiply(JSBI.BigInt(pledgeValue), JSBI.BigInt(1e18)).toString(10) : Math.round(parseFloat(pledgeValue) * 1e18).toString()
      await deposit(poolId, amount, () => {
        // let data = {
        //   type: 'success',
        //   tips: t('operateSuccess')
        // };
        // setStatus(data);
      })
    } catch (err) {
      setHarvest(false);
      console.log("deposit err is ", err)
      let data = {
        type: 'failed',
        tips: t('operateFailed')
      };
      setStatus(data);
    }
  }

  let btn = (
    <div className="s-boardroom-select s-boardroom-stake-button" onClick={
      async () => {
        if (approval != ApprovalState.APPROVED) {
          await approveCallback(() => {
            setStatus({
              type: 'success',
              tips: t('operateSuccess')
            });
          })
        }
      }
    }>{t('authorization')}</div>);

  if (approval == ApprovalState.APPROVED) {
    btn = (<div>
      <div className="s-boardroom-select s-boardroom-stake-button" onClick={async () => { setShowConfirmation(true); }}>{t('pledge')}<QuestionHelper text={t('pledgeTip')} /></div>
      <div className="s-boardroom-select s-boardroom-stake-button" onClick={onWithdraw}  >{t('cancelPledge')}<QuestionHelper text={t('cancelPledgeTip')} /></div></div>
    );
  }
  function onDismiss(){
    // let data = {
    //   type: 'success',
    //   tips: t('operateSuccess')
    // };
    // setStatus(data);
  }
  return (
    <>
      <Sloganer />
      <div className="s-boardroom-selected">
        <div className="s-boardroom-account">
          <p>{t('myReward')}</p>
          <p className="s-boardroom-balance">
            <img src={ZooSwapLogo} />
            {myReward.toString(10)}
          </p>
          <div className="s-boardroom-select s-boardroom-tokens" onClick={async () => { await onHarvest() }}>{t('withdrawal')}</div>
        </div>
        <div className="s-boardroom-stake">
          <p>{t('pledgedLP')}</p>
          <p className="s-boardroom-balance">{myStaked} </p>
          {btn}
        </div>
      </div>

      <Modal isOpen={showConfirmation} onDismiss={() => setShowConfirmation(false)} maxHeight={100}>
        <div className="s-modal-content">
          <ModalContentWrapper className="s-ModalContentWrapper">
            <RowBetween style={{ padding: '0.8rem' }}>
              <div style={{ textAlign: 'center', display: 'inline-block', width: '80%', paddingLeft: '2rem' }}>
                <Text fontWeight={500} fontSize={20}>
                {t('pledge')}
              </Text>
              </div>
              <StyledCloseIcon onClick={() => setShowConfirmation(false)} />
            </RowBetween>
          </ModalContentWrapper>
          <div className="s-modal-main">
            <div className="s-boardroom-max">
              <h2>ZOO</h2>
              <div className="s-modal-number">
                <input type="number" value={pledgeValue} onChange={(e) => { setPledgeValue(e.target.value) }} />
                <em onClick={() => setPledgeValue(myLpBalance.toString(10))}>MAX</em>
              </div>
            </div>
            <p className="s-boardroom-available">{myLpBalance.toString(10)} available</p>
          </div>
          <div className="s-modal-btns">
            <ButtonGray padding="8px 16px" mt="0.5rem" onClick={() => setShowConfirmation(false)}>
            {t('cancel')}
          </ButtonGray>
            <ButtonPrimary padding="8px 16px" mt="0.5rem" onClick={onDeposit}>
            {t('confirm')}
          </ButtonPrimary>
          </div>
        </div>
      </Modal>

      <Modal isOpen={hasPendingTransactions} onDismiss={onDismiss} maxHeight={100}>
        <div className="s-modal-content">
          <div className="s-modal-loading">
            <div className="s-modal-loading-img">
              <LoadingRings />
            </div>
            <h2 style={{color:'#FFF'}}>{t('loading')}</h2>
          </div>
          <p className="s-boardroom-available">Deposite {myReward.toString(10)} zooswap LP</p>
        </div>
      </Modal>

      <Modal isOpen={status.type != 'init'} onDismiss={() => setStatus({ type: 'init', tips: '' })} maxHeight={100}>
        <div className="s-modal-content">
          <div className={status.type != 'failed' ? 's-modal-loading s-modal-success' : 's-modal-loading s-modal-fail'}>
            <h2>{status.tips}</h2>
          </div>
        </div>
      </Modal>
    </>
  )
}


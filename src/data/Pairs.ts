import { APIHost } from "../constants";
import { useState, useEffect } from "react";

export function  usePairStaticsInfo() :[number,number,number,number] {
  const [staticsInfo,setStaticsInfo] = useState({tradeOneDay:0,stakedTotal:0,buybackCurrTvl:0,buybackTotalTvl:0})
     //获取24小时交易和 抵押金额

  useEffect(()=>{
    const timer = setInterval(async ()=>{
        const {tradeOneDay,stakedTotal,buybackCurrTvl,buybackTotalTvl} = await(await fetch(APIHost + "/pairs")).json();
        setStaticsInfo({tradeOneDay,stakedTotal,buybackCurrTvl,buybackTotalTvl})

    },3000)
    return () =>{
      clearInterval(timer)
    }
  },[])

  return [staticsInfo.tradeOneDay,staticsInfo.stakedTotal,staticsInfo.buybackCurrTvl,staticsInfo.buybackTotalTvl]

}
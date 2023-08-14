import React, { useEffect, useRef, useState } from 'react';
import Header from '@/components/Header';
import {useLocation, useNavigate} from 'react-router-dom'
import s from './style.module.less';
import {get, post, typeMap} from '@/utils'
import CustomIcon from '../../components/CustomIcon'
import PopupAddBill from '@/components/PopupAddBill'
import cx from 'classnames'
import dayjs from 'dayjs'
import { Modal, Toast } from 'zarm';

const Detail = () => {
  const location = useLocation() //获取当前路由信息
  const id = location.search.split('=')[1]
  const [ detail, setDetail ] = useState({})
  const navigateTo = useNavigate()
  const editRef = useRef()

  const getDetail = async ()=>{
    const { data } = await get(`/api/bill/detail?id=${id}`)
    console.log(data);
    setDetail(data)
  }

  const deleteDetail = ()=>{
    Modal.confirm({
      title:'删除',
      content:'确认删除账单？',
      onOk: async ()=>{
        const { data } = await post('/api/bill/delete',{ id })
        Toast.show('删除成功')
        navigateTo(-1)
      }
    })
  }

  useEffect(()=>{
    getDetail()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])
  return <div className={s.detail}>
    <Header title='账单详情' />
    <div className={s.card}>
      <div className={s.type}>
        <span className={cx({ [s.expense]: detail.pay_type == 1, [s.income]: detail.pay_type == 2})}>
          <CustomIcon type={detail.type_id ? typeMap[detail.type_id].icon : 1}/>
        </span>
        <span>{detail.type_name || ''}</span>
      </div>
      {
        detail.pay_type == 1 ?
          <div className={cx(s.expense,s.amount)}>{detail.amount}</div>
          : <div className={cx(s.income, s.amount)}>{detail.amount}</div>
      }
      <div className={s.info}>
        <div className={s.time}>
          <span>记录时间</span>
          <span>{dayjs(Number(detail.date)).format('YYYY-MM-DD HH:mm')}</span>
        </div>
        <div className={s.remark}>
          <span>备注</span>
          <span>{detail.remark || ''}</span>
        </div>
      </div>
      <div className={s.operation}>
        <span onClick={deleteDetail}><CustomIcon type='icon-shanchu'/> 删除</span>
        <span onClick={() => editRef.current && editRef.current.show()}><CustomIcon type='icon-bianji'/> 编辑</span>
      </div>
    </div>
    <PopupAddBill ref={editRef} detail={detail} onReload={getDetail}/>
  </div>
}

export default Detail

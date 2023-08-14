import React, { forwardRef, useEffect, useState } from 'react'
import s from './style.module.less'
import { Popup, Icon, Keyboard, Input, Toast } from 'zarm';
import cx from 'classnames'
import dayjs from 'dayjs'
import PopupDate from '../PopupDate'
import { useRef } from 'react';
import CustomIcon from '../CustomIcon'
import {get, post, typeMap} from '../../utils'
import PropTypes from 'prop-types';

// eslint-disable-next-line react/display-name
const PopupAddBill = forwardRef((props,ref)=>{
  const { detail={} } = props
  const [ show, setShow ] = useState(false) //弹窗显示
  const [ payType, setPayType ] = useState('expense'); // 支出或收入类型
  const dateRef = useRef()
  const [ amount, setAmount ] = useState(''); // 账单价格
  const [ currentType, setCurrentType ] = useState({}) //存放消费类型的信息
  const [ expense, setExpense ] = useState([]); // 支出类型数组
  const [ income, setIncome ] = useState([]); // 收入类型数组
  const [ date, setDate ] =useState(new Date())
  const [ remark, setRemark ] = useState('')
  const [ showRemark, setShowRemark ] = useState(false)
  if(ref){
    ref.current = {
      show:()=>{
        setShow(true)
      },
      close: ()=>{
        setShow(false)
      }
    }
  }
  const changeType = (value)=>{
    setPayType(value)
    if (value == 'expense') {
      setCurrentType(expense[0]);
    } else {
      setCurrentType(income[0]);
    }
  }
  const selectDate = (val)=>{
    setDate(val)
  }
  const handleMoney = (value)=>{
    value = String(value)
    if (value == 'close'){
      setShow(false)
      return
    } 
    // 点击删除按钮时
    if( value == 'delete'){
      let _amount = amount.slice(0,amount.length - 1)
      setAmount(_amount)
      return
    }
    // 点击确认按钮是
    if(value == 'ok'){
      addBill()
      return
    }
    // 当输入的值为 '.' 且 已经存在 '.'，则不让其继续字符串相加。
    if (value == '.' && amount.includes('.')) return
    // 小数点后保留两位，当超过两位时，不让其字符串继续相加。
    if (value != '.' && amount.includes('.') && amount && amount.split('.')[1].length >= 2) return
    // amount += value
    setAmount(amount + value)
  }

  // 添加账单
  const addBill = async ()=>{
    if(!amount){
      Toast.show('请输入金额')
      return
    }

    const params = {
      amount: Number(amount).toFixed(2),
      type_id: currentType.id,
      type_name: currentType.name,
      date: dayjs(date).unix() * 1000,
      pay_type: payType == 'expense' ? 1 : 2,
      remark: remark || ''
    }
    // 如果有id就是修改,没有就是新增
    if(detail.id){
      params.id = detail.id
      const result = await post('/api/bill/update',params)
      Toast.show('修改成功')
    } else{
      const result = await post('/api/bill/add', params)
      // 重置数据
      setAmount('')
      setPayType('expense')
      setCurrentType(expense[0])
      setDate(new Date())
      setRemark('')
      Toast.show('添加成功')
    }
    // 关闭弹窗
    setShow(false)
    // 刷新界面
    // eslint-disable-next-line react/prop-types
    if(props.onReload) props.onReload();
  }

  useEffect(()=>{
    if (detail.id) {
      setPayType(detail.pay_type == 1 ? 'expense' : 'income')
      setCurrentType({
        id:detail.id,
        name:detail.type_name
      })
      setRemark(detail.remark)
      setAmount(detail.amount)
      setDate(dayjs(Number(detail.date)).$d)
    }
  },[detail])

  // 拿到所有的消费类型
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async ()=>{
    const {data:{list}} = await get('/api/type/list')
    const _expense = list.filter(i => i.type == 1 )
    const _income = list.filter(i => i.type == 2)
    setExpense(_expense)
    setIncome(_income)
    if (!detail.id){
      // 如果没有id就是新账单
      setCurrentType(_expense[0])
    }
  },[])
  return(
    <Popup
      visible={show}
      direction='bottom'
      onMaskClick={()=> setShow(false)}
      destroy={false}
      mountContainer={()=> document.body}
    >
      <div className={s.addWrap}>
        <header className={s.header}>
          <span className={s.close} onClick={() => setShow(false)}><Icon type='icon-guanbi1'/></span>
        </header>
        <div className={s.filter}>
          <div className={s.type}>
            <span onClick={() => changeType('expense')} className={cx({ [s.expense]: true, [s.active]: payType == 'expense' })}>支出</span>
            <span onClick={() => changeType('income')} className={cx({ [s.income]: true, [s.active]: payType == 'income' })}>收入</span>
          </div>
          <div
            className={s.time}
            onClick={() => dateRef.current && dateRef.current.show()}
          >
            {dayjs(date).format('MM-DD')} <Icon type='icon-xuanzeqizhankai_o' className={s.arrow}/>
          </div>
        </div>
          <div className={s.money}>
            <span className={s.sufix}>¥</span>
            <span className={cx(s.amount, s.animation)}>{amount}</span>
          </div>
          <div className={s.typeWarp}>
            <div className={s.typeBody}>
              {
                (payType == 'expense' ? expense : income).map(item => <div onClick={()=>setCurrentType(item)} key={item.id} className={s.typeItem}>
                  <span className={cx({ [s.iconfontWrap]: true, [s.expense]: payType == 'expense', [s.income]: payType == 'income', [s.active]: currentType.id == item.id })}>
                    <CustomIcon className={s.iconfont} type={typeMap[item.id].icon} />
                  </span>
                  <span>{item.name}</span>
                </div>)
              }
            </div>
        </div>
        <div className={s.remark}>
          {
            showRemark ? <Input
              autoHeight
              showLength
              maxLength={50}
              type="text"
              rows={3}
              value={remark}
              placeholder="请输入备注信息"
              onChange={(val) => setRemark(val)}
              onBlur={() => setShowRemark(false)}
            /> : <span onClick={()=> setShowRemark(true)}>{remark || '添加备注'}</span>
          }
        </div>
        <Keyboard type="price" onKeyClick={(value) => handleMoney(value)} />
        <PopupDate ref={dateRef} onSelect={selectDate}/>
      </div>
    </Popup>
  )
})

PopupAddBill.propTypes = {
  detail: PropTypes.object,
  onReload: PropTypes.func
}
export default PopupAddBill;
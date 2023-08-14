import s from './style.module.less'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import {useNavigate} from 'react-router-dom'
import { Cell, Message } from 'zarm'
import CustomIcon from '@/components/CustomIcon'
import {typeMap} from '@/utils'
import dayjs from 'dayjs'

const BillItem = (props)=>{
  const { bill } = props
  const [expense, setExpense] = useState(0)
  const [income, setIncome] = useState(0)
  const navigateTo = useNavigate()

  const goToDetail = item =>{
    navigateTo(`/detail?id=${item.id}`)
  }
  useEffect(()=>{
    const _income = bill.bills.filter(i => i.pay_type == 2).reduce((curr, item) => {
      curr += Number(item.amount);
      return curr;
    }, 0);
    setIncome(_income);
    const _expense = bill.bills.filter(i => i.pay_type == 1).reduce((curr, item) => {
      curr += Number(item.amount);
      return curr;
    }, 0);
    setExpense(_expense);
  },[bill.bills])
  return (
    <div className={s.item}>
      <div className={s.headerDate}>
        <div className={s.date}>{bill.date}</div>
        <div className={s.money}>
          <span>
            <div className="expenseLogo">支</div>
            <span>¥{expense.toFixed(2)}</span>
          </span>
          <span>
            <div className="incomeLogo">收</div>
            <span>¥{income.toFixed(2)}</span>
          </span>
        </div>
      </div>
      {
        bill && bill.bills.sort((a, b) => b.date - a.date).map(item=> <Cell
          key={item.id}
          className={s.bill}
          onClick={()=> goToDetail(item)}
          title={
            <>
              <CustomIcon
                className={s.itemIcon}
                type={item.type_id ? typeMap[item.type_id].icon : 1}
              />
              <span>{item.type_name}</span>
            </>
          }
          description={<span style={{color: item.pay_type ==2 ? 'red' : '#39be77'}}>
            {`${item.pay_type == 1 ? '-' : '+'}${Number(item.amount).toFixed(2)}`}
            </span>}
          help={<Message>{dayjs(Number(item.date)).format('HH:mm')} {item.remark ? `| ${item.remark}` : ''}</Message>}
        ></Cell>)
      }
    </div>
  )
}

BillItem.propTypes = {
  bill: PropTypes.object
}

export default BillItem
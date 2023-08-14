import React, { forwardRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Popup, Icon} from 'zarm'
import cx from 'classnames'
import s from './style.module.less'
import { get } from '@/utils'
import { useEffect } from 'react'
// eslint-disable-next-line react/display-name
const PopupType = forwardRef((props, ref)=>{
  const [show, setShow] = useState(false)
  const [active, setActive ] = useState('all')
  const [expense, setExpense] = useState([])
  const [income, setIncome] = useState([])
  const { onSelect } = props
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async()=>{
    const { data: { list } } = await get('/api/type/list')
    setExpense(list.filter(i => i.type == 1))
    setIncome(list.filter(i => i.type == 2))
  },[])
  const choseType = (item) => {
    setActive(item.id)
    setShow(false)
    onSelect(item)
  };
  if (ref) {
    ref.current = {
      show: () => {
        setShow(true)
      },
      close: () => {
        setShow(false)
      }
    }
  }
  return(
    <Popup
      visible={show}
      direction='bottom'
      onMaskClick={()=> setShow(false)}
      destroy={false}
      mountContainer={()=> document.body}
    >
      <div className={s.popupType}>
        <div className={s.header}>
          请选择类型
          <Icon type='icon-guanbi1' className={s.cross} onClick={()=> setShow(false)}/>
        </div>
        <div className={s.content}>
          <div onClick={() => choseType({ id: 'all' })} className={cx({ [s.all]: true, [s.active]: active == 'all' })}>全部类型</div>
          <div className={s.title}>支出</div>
          <div className={s.expenseWrap}>
            {
              expense.map((item, index)=> <p key={index} onClick={()=> choseType(item)} className={cx({[s.active]: active == item.id})}>
                {item.name}
              </p>)
            }
          </div>
            <div className={s.title}>收入</div>
            <div className={s.incomeWrap}>
              {
                income.map((item, index) => <p key={index} onClick={() => choseType(item)} className={cx({[s.active]: active == item.id})}>
                  {item.name}
                </p>)
              }
            </div>
        </div>
      </div>
    </Popup>   
  )
})

PopupType.propTypes = {
  onSelect: PropTypes.func

}

export default PopupType;
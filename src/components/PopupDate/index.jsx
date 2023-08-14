import React from 'react'
import s from './style.module.less'
import PropTypes from 'prop-types'
import { DatePicker, Popup } from 'zarm'
import { useState } from 'react'
import dayjs from 'dayjs'
import { forwardRef } from 'react'

// eslint-disable-next-line react/display-name
const PopupDate = forwardRef(({ mode = 'date', onSelect },ref)=>{
  const [ show, setShow ] = useState(false)
  const [ now, setNow ] = useState(new Date())
  const choseMonth = (item)=>{
    setNow(item)
    setShow(false)
    console.log(mode);
    if(mode == 'month'){
      onSelect(dayjs(item).format('YYYY-MM'))
    } else if(mode == 'date') {
      console.log('2');
      onSelect(dayjs(item).format('YYYY-MM-DD'))
    }
  }
  if(ref){
    ref.current = {
      show:()=>{
        setShow(true)
      },
      close:()=>{
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
      mountContainer={() => document.body}
    >
      <div>
        <DatePicker
          visible={show}
          value={now}
          mode={mode}
          onOk={choseMonth}
          onCancel={()=> setShow(false)}
        />
      </div>
    </Popup>
  )
})

PopupDate.propTypes = {
  mode: PropTypes.string,
  onSelect: PropTypes.func
}

export default PopupDate
import React from 'react'
import { useState, useEffect } from 'react'
import { Icon, Loading, Pull } from 'zarm'
import BillItem from '@/components/BillItem'
import PopupType from '@/components/PopupType'
import s from './style.module.less'
import dayjs from 'dayjs'
import { get, REFRESH_STATE, LOAD_STATE } from '@/utils'
import { useRef } from 'react'
import PopupDate from '@/components/PopupDate'
import CustomIcon from '@/components/CustomIcon'
import PopupAddBill from '@/components/PopupAddBill'

const Home = () => {
  const [list, setList] = useState([])
  const [page, setPage] = useState(1)
  const [totalPage, setTotalPage] = useState(0)
  const [currentTime, setCurrentTime] = useState(dayjs().format('YYYY-MM'))
  const [refreshing, setRefreshing] = useState(REFRESH_STATE.normal) //下拉刷新
  const [loading, setLoading] = useState(LOAD_STATE.normal) //上拉加载刷新
  const typeRef = useRef() //类型组件绑定ref
  const [currentSelect, setCurrentSelect] = useState({})
  const monthRef = useRef() //日期选择组件绑定ref
  const [totalExpense, setTotalExpense] = useState(0); // 总支出
  const [totalIncome, setTotalIncome] = useState(0); // 总收入
  const addRef = useRef()

  const getBillList = async ()=> {
    // 获取数据
    const { data } = await get(`/api/bill/list?page=${page}&page_size=5&date=${currentTime}&type_id=${currentSelect.id || 'all'}`);
    if(page == 1){
      setList(data.list)
    } else {
      setList(list.concat(data.list))
    }
    setTotalExpense(data.totalExpense.toFixed(2));
    setTotalIncome(data.totalIncome.toFixed(2));

    setTotalPage(data.totalPage)
    setLoading(LOAD_STATE.success)
    setRefreshing(REFRESH_STATE.success)
  }

  const refreshData = ()=>{
    setRefreshing(REFRESH_STATE.loading)
    if(page != 1){
      setPage(1)
    } else {
      getBillList()
    }
  }
  const loadData = ()=>{
    if( page < totalPage){
      setLoading(LOAD_STATE.loading)
      setPage(page + 1)
    }
  }

  // 添加账单弹窗
  const toggle = () => {
    typeRef.current && typeRef.current.show()
  };

  const select = (item) => {
    setRefreshing(REFRESH_STATE.loading);
    // 触发刷新列表，将分页重制为 1
    setPage(1);
    setCurrentSelect(item)
  }

  // 选择月份弹窗
  const monthToggle = ()=>{
    monthRef.current && monthRef.current.show()
  }
  //筛选月份
  const selectMonth = (item)=>{
    setRefreshing(REFRESH_STATE.loading)
    setPage(1)
    setCurrentTime(item)
  }

  const addToggle = ()=>{
    addRef.current && addRef.current.show()
  }

  useEffect(()=>{
    getBillList()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[page,currentSelect,currentTime])
  return (
  <div className={s.home}>
    <div className={s.header}>
      <div className={s.dataWrap}>
          <span className={s.expense}>总支出：<p>¥{totalExpense}</p></span>
          <span className={s.expense}>总收入：<p>¥{totalIncome}</p></span>
      </div>
      <div className={s.typeWrap}>
        <div className={s.left} onClick={toggle}>
            <span className={s.title}>{currentSelect.name || '全部类型'} <Icon className={s.arrow} type='icon-xuanzeqizhankai_o'/></span>
        </div>
          <div className={s.right}>
            <span className={s.title} onClick={monthToggle}>{currentTime}<Icon className={s.arrow} type='icon-xuanzeqizhankai_o' /></span>
          </div>
      </div>
    </div>
      <div className={s.contentWrap}>
        {
          list.length ? <Pull
            animationDuration={200}
            stayTime={400}
            refresh={{
              state: refreshing,
              handler: refreshData
            }}
            load ={{
              state: loading,
              distance:200,
              handler: loadData
            }}
          >
            {
              list.map((item, index) => <BillItem key={index} bill={item} />)
            }
          </Pull> : null
        }
      </div>
      <div className={s.add} onClick={addToggle}><CustomIcon type='icon-bianji' /></div>
      <PopupType ref={typeRef} onSelect={select} />
      <PopupDate ref={monthRef} mode="month" onSelect={selectMonth} />
      <PopupAddBill ref={addRef} onReload={refreshData} />
  </div>
  )
}

export default Home
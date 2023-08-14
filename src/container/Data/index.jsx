import React, { useEffect, useRef, useState } from 'react';
import { Icon, Progress } from 'zarm';
import cx from 'classnames';
import dayjs from 'dayjs';
import { get, typeMap } from '@/utils'
import CustomIcon from '@/components/CustomIcon'
import PopupDate from '@/components/PopupDate'
import s from './style.module.less';

let proportionChart = null;
const Data = () => {
  const monthRef = useRef() 
  const [ currentMonth, setCurrentMonth ] = useState(dayjs().format('YYYY-MM'));
  const [ totalExpense, setTotalExpense ] = useState(0) //总支出
  const [ totalIncome, setTotalIncom] = useState(0)   //总收入
  const [ totalType, setTotalType ] = useState('expense')
  const [ incomeData, setIncomeData ] = useState([]) //收入列表
  const [ expenseData, setExpenseData ] = useState([]) //支出列表
  const [pieType, setPieType] = useState('expense'); // 饼图的「收入」和「支出」控制
  const showMonth = ()=>{
    monthRef.current && monthRef.current.show()
  }

  const changePieType = (type) => {
    setPieType(type);
    // 重绘饼图
    setPieChart(type == 'expense' ? expenseData : incomeData);
  }

  // 选择日期
  const selectMonth = (item)=>{
    setCurrentMonth(item)
  }

  //切换支出收入
  const changeTotalType = (item)=>{
    setTotalType(item)
  }
  // 绘制饼图方法
  const setPieChart = (data) => {
    if (window.echarts) {
      // 初始化饼图，返回实例。
      // eslint-disable-next-line no-undef
      proportionChart = echarts.init(document.getElementById('proportion'));
      proportionChart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        // 图例
        legend: {
          data: data.map(item => item.type_name)
        },
        series: [
          {
            name: '支出',
            type: 'pie',
            radius: '55%',
            data: data.map(item => {
              return {
                value: item.number,
                name: item.type_name
              }
            }),
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      })
    }
  };

  const getData = async ()=>{
    // 获取月份所有支出和收入
    const result = await get(`/api/bill/data?date=${currentMonth}`)
    const ex = result.data.total_expense
    const inc = result.data.total_income
    const total_data = result.data.total_data
    setTotalExpense(ex)
    setTotalIncom(inc)

    const ex_data = total_data.filter((item, index) => {  //过滤支出数据
      return item.pay_type == 1
    }).sort((a, b) => b.number - a.number); //按价格降序

    const inc_data = total_data.filter((item, index) => { //过滤收入数据
      return item.pay_type == 2
    }).sort((a, b) => b.number - a.number);  //按价格降序
    setIncomeData(ex_data)
    setExpenseData(inc_data)
    setPieChart(pieType == 'expense' ? ex_data : inc_data);
  }


  useEffect(() => {
    getData();
    return () => {
      // 每次组件卸载的时候，需要释放图表实例。clear 只是将其清空不会释放。
      proportionChart.dispose();
    };
  }, [currentMonth]);
  return <div className={s.data}>
    <div className={s.total}>
      <div className={s.time} onClick={showMonth}>
        <span>2021-06</span>
        <Icon className={s.date} type="date" />
      </div>
      <div className={s.title}>共支出</div>
      <div className={s.expense}>¥{totalExpense}</div>
      <div className={s.income}>共收入¥{totalIncome}</div>
    </div>
    <div className={s.structure}>
        <div className={s.head}>
          <span className={s.title}>收支构成</span>
          <div className={s.tab}>
              <span onClick={()=> changeTotalType('expense')}
                className={cx({ [s.expense]: true, [s.active]: totalType == 'expense' })}
              >
                支出
              </span>
              <span onClick={() => changeTotalType('income')}
                className={cx({ [s.expense]: true, [s.active]: totalType == 'income'})}
              >
                收入
              </span>
          </div>
        </div>
        <div className={s.content}>
          {
            (totalType  == 'expense' ? expenseData : incomeData).map((item,index)=>{
              return <div key={item.type_id} className={s.item}>
                <div className={s.left}>
                  <div className={s.type}>
                    <span className={cx({ [s.expense]: totalType == 'expense', [s.income]: totalType == 'income'})}>
                      <CustomIcon type={item.type_id ? typeMap[item.type_id].icon : 1}/>
                    </span>
                    <span className={s.name}>{item.type_name}</span>
                  </div>
                  <div className={s.progress}>¥{Number(item.number).toFixed(2) || 0}</div>
                </div>
                <div className={s.right}>
                  <div className={s.percent}>
                    <Progress
                      shape='line'
                      percent={Number((item.number / Number(totalType == 'expense' ? totalExpense : totalIncome)) * 100).toFixed(2)}
                      theme='primary'
                    />
                  </div>
                </div>
              </div>
            })
          }
        </div>
        <div className={s.proportion}>
          <div className={s.head}>
            <span className={s.title}>收支构成</span>
            <div className={s.tab}>
              <span onClick={() => changePieType('expense')} className={cx({ [s.expense]: true, [s.active]: pieType == 'expense' })}>支出</span>
              <span onClick={() => changePieType('income')} className={cx({ [s.income]: true, [s.active]: pieType == 'income' })}>收入</span>
            </div>
          </div>
            <div id="proportion"></div>
        </div>
    </div>
    <PopupDate ref={monthRef} mode="month" onSelect={selectMonth} />
  </div>
}

export default Data
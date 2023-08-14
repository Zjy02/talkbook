import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { TabBar } from "zarm"
import PropTypes from 'prop-types'
import s from './style.module.less'
import CustomIcon from '../CustomIcon'
const NavBar = (props) => {
  // eslint-disable-next-line react/prop-types
  const { showNav } = props
  const [ activeKey, setActiveKey ] = useState('/')
  const navigateTo = useNavigate()
  const changeTab = (path) =>{
    setActiveKey(path)
    navigateTo(path)
  }
  return(
    <TabBar visible={showNav} className={s.tab} activeKey={activeKey} onChange={changeTab}>
      <TabBar.Item
        itemKey='/'
        title="账单"
        icon={<CustomIcon type="icon-zhangdan" />}
      />
      <TabBar.Item
        itemKey='/data'
        title="统计"
        icon={<CustomIcon type="icon-tongji1" />}
      />
      <TabBar.Item
        itemKey='/user'
        title="我的"
        icon={<CustomIcon type="icon-gerenzhongxin1" />}
      />
    </TabBar>
  )
}
NavBar.propType = {
  showNav: PropTypes.bool
}
export default NavBar
import React, { useEffect, useState } from 'react';
import {get} from '@/utils'
import s from './style.module.less';
import {Cell, Button} from 'zarm'
import {useNavigate} from 'react-router-dom'

const User = () => {
  const [ user, setUser ] = useState({})
  const [ avatar, setAvatar ] = useState('')
  const navigateTo = useNavigate()
  const getUserInfo = async () =>{
    const result = await get('/api/user/get_userinfo')
    setUser(result.data)
    setAvatar(result.data.avatar)
  }

  const logout = ()=>{
    localStorage.removeItem('token')
    navigateTo('/login')
  }

  useEffect(()=>{
    getUserInfo()
  },[])
  return <div className={s.user}>
    <div className={s.head}>
      <div className={s.info}>
        <span>昵称：{user.username}</span>
        <span>
          <img style={{ width: 30, height: 30, verticalAlign: '-10px' }} src="//s.yezgea02.com/1615973630132/geqian.png" alt="" />
          <b>{user.signature || '个性签名'}</b>
        </span>
      </div>
      <img className={s.avatar} src={user.avatar} alt="" />
    </div>
    <div className={s.content}>
      <Cell
        hasArrow
        title="用户信息修改"
        onClick={() => navigateTo('/userinfo')}
        icon={<img style={{ width: 20, verticalAlign: '-7px' }} src="//s.yezgea02.com/1615974766264/gxqm.png" alt="" />}
      />
      <Cell
        hasArrow
        title="重制密码"
        onClick={() => navigateTo('/account')}
        icon={<img style={{ width: 20, verticalAlign: '-7px' }} src="//s.yezgea02.com/1615974766264/zhaq.png" alt="" />}
      />
      <Cell
        hasArrow
        title="关于我们"
        onClick={() => navigateTo('/about')}
        icon={<img style={{ width: 20, verticalAlign: '-7px' }} src="//s.yezgea02.com/1615975178434/lianxi.png" alt="" />}
      />
    </div>
    <Button className={s.logout} block theme='danger' onClick={logout}>退出登录</Button>
  </div>
}

export default User

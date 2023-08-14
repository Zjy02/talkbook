import s from './style.module.less'
import React from 'react'
import cx from 'classnames';
import { Cell, Input, Button, Checkbox, Toast } from 'zarm'
import { post } from '@/utils'
import CustomIcon from '@/components/CustomIcon'
import { useState, useRef, useCallback, useEffect } from 'react'
import ReactSimpleVerify from 'react-simple-verify'
import 'react-simple-verify/dist/react-simple-verify.css'
// import CustomIcon from '@/component/CustomIcon'

const Login = ()=>{
  const verifyRef = useRef();
  const [type, setType] = useState('login'); // 登录注册类型
  const [username, setUsername] = useState(''); // 账号
  const [password, setPassword] = useState(''); // 密码
  const [verify, setVerify] = useState(false); // 验证码


  const onSubmit = async () => {
    if (!username) {
      Toast.show('请输入账号')
      return
    }
    if (!password) {
      Toast.show('请输入密码')
      return
    }
    try {
      if (type == 'login') {
        const { data } = await post('/api/user/login', {
          username,
          password
        });
        localStorage.setItem('token', data.token);
        window.location.href = '/';
      } else {
        if (!verify) {
          Toast.show('请进行验证')
          return
        }
        const { data } = await post('/api/user/register', {
          username,
          password
        })
        Toast.show('注册成功');
        setType('login');
      }
    } catch (err) {
      Toast.show(err.msg);
    }
  };

  const handle = (e)=>{
    setVerify(true)
    console.log('1');
    console.log(verify);
  }

  useEffect(() => {
    document.title = type == 'login' ? '登录' : '注册';
  }, [type])
  return(
    <div className={s.auth}>
      <div className={s.head} />
      <div className={s.tab}>
        <span className={cx({ [s.avtive]: type == 'login' })} onClick={() => setType('login')}>登录</span>
        <span className={cx({ [s.avtive]: type == 'register' })} onClick={() => setType('register')}>注册</span>
      </div>
      <div className={s.form}>
        <Cell icon={<CustomIcon type="icon-guanbi" />}>
          <Input
            clearable
            type="text"
            placeholder="请输入账号"
            onChange={(value) => setUsername(value)}
          />
        </Cell>
        <Cell icon={<CustomIcon type="icon-mima"/>}>
          <Input
            clearable
            type="password"
            placeholder="请输入密码"
            onChange={(value) => setPassword(value)}
          />
        </Cell>
        {
          type == 'register' ? <Cell>
            <ReactSimpleVerify ref={verifyRef} success={e => handle()} />
          </Cell> : null
        }
      </div>
      <div className={s.operation}>
        {
          type == 'register' ? <div className={s.agree}>
            <Checkbox />
            <label className="text-light">阅读并同意<a>《法律条款》</a></label>
          </div> : null
        }
        <Button onClick={onSubmit} block theme="primary">{type == 'login' ? '登录' : '注册'}</Button>
      </div>
    </div>
  )
}

export default Login
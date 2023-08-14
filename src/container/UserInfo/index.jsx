import React, { useEffect, useState } from 'react';
import {get} from '@/utils'
import s from './style.module.less';
import { Button, FilePicker, Input, Toast } from 'zarm';
import Header from '@/components/Header'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import {post} from '@/utils'

const UserInfo = () => {
  const [ user, setUser ] = useState({})
  const [ avatar, setAvatar ] = useState('')
  const [ signature, setSignature ] = useState('')
  const navigateTo = useNavigate()
  const token = localStorage.getItem('token')

  const getUserInfo = async()=>{
    const result = await get('/api/user/get_userinfo')
    setUser(result.data)
    setAvatar(result.data.avatar)
    setSignature(result.data.signature)
  }

  const handleSelect = (file)=>{
    if( file && file.file.size > 200 * 1024){
      Toast.show('上传头像不得超过200KB')
      return
    }
    let formData = new FormData()
    formData.append('file',file.file)
    
    axios({
      method:'post',
      url:`http://localhost:7001/api/upload`,
      data: formData,
      headers:{
        'Content-Type':'multipart/form-data',
        'Authorization': token
      }
    }).then((res)=>{
      console.log(res);
      let url = 'http://localhost:7001' + res.data
      console.log(url);
      setAvatar(url)
    })
  }

  const save = async ()=>{
    const result = await post('/api/user/edit_userinfo',{
      signature,
      avatar
    })
    Toast.show('修改成功')
    navigateTo(-1)
  }

  useEffect(()=>{
    getUserInfo()
  },[])
  return (
    <>
      <Header title='修改信息' />
      <div className={s.userinfo}>
        <h1>个人资料</h1>
        <div className={s.item}>
          <div className={s.title}>头像</div>
          <div className={s.avatar}>
            <img className={s.avatarUrl} src={avatar} alt="" />
            <div className={s.desc}>
              <span>支持 png jpeg jpg 格式大小 200KB以内</span>
              <FilePicker onChange={handleSelect} accept='image/*'>
                <Button className={s.upload} theme='primary' size='xs'>点击上传</Button>
              </FilePicker>
            </div>
          </div>
        </div>
        <div className={s.item}>
          <div className={s.title}>个性签名</div>
          <div className={s.signature}>
            <Input
              clearable
              type='text'
              value={signature}
              placeholder='请输入个性签名'
              onChange={(value)=> setSignature(value)}
            />
          </div>
        </div>
        <Button onClick={save} style={{marginTop: 50}} block theme='primary'>保存</Button>
      </div>
    </>
  )
}

export default UserInfo

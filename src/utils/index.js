import axios from "./axios";

export const get = axios.get

export const post = axios.post

export const typeMap = {
  1: {
    icon: 'icon-a-godutch'
  },
  2: {
    icon: 'icon-fushi'
  },
  3: {
    icon: 'icon-gongjiao'
  },
  4: {
    icon: 'icon-riyongcopy'
  },
  5: {
    icon: 'icon-gouwu'
  },
  6: {
    icon: 'icon-xuexi'
  },
  7: {
    icon: 'icon-yaopin'
  },
  8: {
    icon: 'icon-lvxing'
  },
  9: {
    icon: 'icon-kequn'
  },
  10: {
    icon: 'icon-qita1'
  },
  11: {
    icon: 'icon-gongzi'
  },
  12: {
    icon: 'icon-feiyong'
  },
  13: {
    icon: 'icon-zhuanzhang'
  },
  14: {
    icon: 'icon-licai'
  },
  15: {
    icon: 'icon-tuikuan'
  },
  16: {
    icon: 'icon-qita'
  }
}

export const REFRESH_STATE = {
  normal: 0, // 普通
  pull: 1, // 下拉刷新（未满足刷新条件）
  drop: 2, // 释放立即刷新（满足刷新条件）
  loading: 3, // 加载中
  success: 4, // 加载成功
  failure: 5, // 加载失败
};

export const LOAD_STATE = {
  normal: 0, // 普通
  abort: 1, // 中止
  loading: 2, // 加载中
  success: 3, // 加载成功
  failure: 4, // 加载失败
  complete: 5, // 加载完成（无新数据）
};
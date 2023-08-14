import Home from '@/container/Home'
import Data from '@/container/Data'
import User from '@/container/User'
import Login from '@/container/Login'
import Detail from '@/container/Detail';
import About from '@/container/About';
import Account from '../container/Account';
import UserInfo from '@/container/UserInfo';
const routes = [
  {
    path: "/",
    element: <Home />
  },
  {
    path: "/data",
    element: <Data />
  },
  {
    path: "/user",
    element: <User />
  },
  {
    path:'/login',
    element: <Login/>
  },
  {
    path:'/detail',
    element: <Detail/>
  },
  {
    path: '/about',
    element: <About />
  },
  {
    path: '/account',
    element: <Account />
  },
  {
    path: '/userinfo',
    element: <UserInfo />
  }
];

export default routes
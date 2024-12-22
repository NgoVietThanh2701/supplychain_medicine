import { Routes, Route } from 'react-router-dom';
import './App.css';
import Dashboard from './containers/Dashboard/Dashboard';
import path from './utils/data/path';
import Login from './containers/Public/Login';
import Home from './containers/Public/Home';
import Register from './containers/Public/Register';
import OtpPage from './containers/Public/OtpPage';
import Shop from './containers/Public/Shop';
import SingleProduct from './containers/Public/SingleProduct';
import BuyToken from './containers/BuyToken';
import RequestUsers from './containers/Dashboard/admin/RequestUsers';
import Users from './containers/Dashboard/admin/Users';
import Harvested from './containers/Dashboard/factory/Production';
import StatisticalAdmin from './containers/Dashboard/admin/StatisticalAdmin';
import StatisticalFM from './containers/Dashboard/factory/StatisticalFactory';
import Category from './containers/Dashboard/factory/Category';
import OrderFM from './containers/Dashboard/factory/OrderFactory';
import StatisticalTPT from './containers/Dashboard/agent/StatisticalAgent';
import ShopProductTPT from './containers/Dashboard/agent/ShopProductAgent';
import PurchaseTPT from './containers/Dashboard/agent/PurchaseAgent';
import StatisticalDH from './containers/Dashboard/deliveryhub/StatisticalDH';
import OrderedTPT from './containers/Dashboard/agent/OrderedAgent';
import ReceiveDH from './containers/Dashboard/deliveryhub/ReceiveDH';
import PurchaseForm from './containers/Public/PurchaseForm';

const App = () => {

   return (
      <Routes>
         {/* System */}
         <Route path={path.DASHBOARD} element={<Dashboard />}>
            {/* admin */}
            <Route path={path.ADMIN_STATISTICAL} element={<StatisticalAdmin />} />
            <Route path={path.ADMIN_REQUEST} element={<RequestUsers />} />
            <Route path={path.ADMIN_USERS} element={<Users />} />
            {/* - factory */}
            <Route path={path.FACTORY_STATISTICAL} element={<StatisticalFM />} />
            <Route path={path.FACTORY_PRODUCT} element={<Harvested />} />
            <Route path={path.FACTORY_CATEGORY} element={<Category />} />
            <Route path={path.FACTORY_ORDER} element={<OrderFM />} />
            {/* third party */}
            <Route path={path.AGENT_STATISTICAL} element={<StatisticalTPT />} />
            <Route path={path.AGENT_SHOP} element={<ShopProductTPT />} />
            <Route path={path.AGENT_PURCHASE_ORDER} element={<PurchaseTPT />} />
            <Route path={path.AGENT_ORDERED} element={<OrderedTPT />} />
            {/* delivery hub */}
            <Route path={path.DELIVERYHUB_STATISTICAL} element={<StatisticalDH />} />
            <Route path={path.DELIVERYHUB_RECEIVE} element={<ReceiveDH />} />
         </Route>
         {/* Public */}
         <Route path={path.LOGIN} element={<Login />} />
         <Route path={path.REGISTER} element={<Register />} />
         <Route path={path.VERIFY_OTP} element={<OtpPage />} />
         {/* ---- */}
         <Route path={path.HOME} element={<Home />} />
         <Route path={path.SHOP} element={<Shop />} />
         <Route path={path.SINGLE_PRODUCT} element={<SingleProduct />} />
         <Route path={path.BUY_TOKEN} element={<BuyToken />} />
         <Route path={path.PURCHARSE_FORM} element={<PurchaseForm />} />
      </Routes>

   )
}

export default App
import { useState, useEffect } from 'react'
import DataTable from '../../../components/Dashboard/DataTable';
import { formatTime, formatToEth } from '../../../utils/function/format';
import SupplyChainContract from '../../../contracts/SupplyChainContract';
import StateProduct from '../../../utils/data/statesProduct';
import { Tabs, TabsHeader, TabsBody, Tab, TabPanel } from "@material-tailwind/react";
import { ethers } from 'ethers';
import { useOutletContext } from 'react-router-dom';
import Swal from 'sweetalert2';
import Loading from '../../../components/Loading';
import SellProductModal from '../../../components/Dashboard/agent/SellProductModal';
import { columnFM } from '../factory/OrderFactory';
import { useSelector } from 'react-redux';
import { useStateContext } from '../../../contexts/ContextProvider';

const nodata_img = require('../../../utils/images/no-data.jpg');

const PurchaseTPT = () => {

   const { currentColor } = useStateContext();
   const web3Provider: ethers.providers.Web3Provider = useOutletContext();
   const { currentUser } = useSelector((state: any) => state.user);

   const [activeTab, setActiveTab] = useState("warehouse");

   const [productsReceive, setProductsReceive] = useState<any>([]);
   const [products, setProducts] = useState<any>([]);
   const [isLoading, setIsLoading] = useState(false);
   const [isOpenModal, setIsOpenModal] = useState(false);
   const [uid, setUid] = useState(0);

   const getProductsReceived = async () => {
      try {
         const supplychainContract = new SupplyChainContract();
         const response = await supplychainContract.getProducts();
         const productFilted = response.filter((data: any) => (data.productState === StateProduct.PurchasedByAgent && data.agentDetails
            .agentCode === currentUser?.code));
         const listProducts = [];
         for (let i = 0; i < productFilted.length; i++) {
            listProducts.push(convertObjectProduct(productFilted[i]));
         }
         setProductsReceive(listProducts.reverse());
      } catch (error) {
         console.log(error);
      }
   }

   const getProducts = async () => {
      try {
         const supplychainContract = new SupplyChainContract();
         const response = await supplychainContract.getProducts();
         const productFilted = response.filter((data: any) => (data.productState === StateProduct.SoldByAgent && data.agentDetails
            .agentCode === currentUser?.code));
         const listProducts = [];
         for (let i = 0; i < productFilted.length; i++) {
            listProducts.push(convertObjectProduct(productFilted[i]));
         }
         setProducts(listProducts.reverse());
      } catch (error) {
         console.log(error);
      }
   }

   const convertObjectProduct = (data: any) => {
      return {
         uid: data.uid.toNumber(),
         productState: data.productState,
         name: data.productDetails.name,
         code: data.productDetails.code,
         price: formatToEth(data.productDetails.price),
         priceAgent: formatToEth(data.productDetails.priceAgent),
         factoryCode: data.factoryDetails.factoryCode,
         category: data.productDetails.category,
         images: data.productDetails.images,
         description: data.productDetails.description,
         quantity: data.productDetails.quantity.toNumber(),
         nsx: data.productDetails.nsx,
         hsd: data.productDetails.hsd
      }
   }

   useEffect(() => {
      if (currentUser?.code) {
         getProductsReceived();
         getProducts();
      }
   }, [currentUser?.code]);

   const handlePostSell = async (uid: number) => {
      if (!web3Provider) {
         Swal.fire('Opps', 'Vui lòng kết nối với ví', 'error');
         return;
      }
      setIsOpenModal(true);
      setUid(uid);
   }

   const actionWarehouse = [
      {
         field: 'action',
         headerName: 'Thao tác',
         width: 95,
         renderCell: (params: any) => (
            <button onClick={() => handlePostSell(params.row.uid)} className='text-white rounded-md py-1 px-2' style={{ backgroundColor: currentColor }}>
               Đăng bán
            </button>
         )
      }
   ]

   const data = [
      {
         label: `Sản phẩm trong kho (${productsReceive.length})`,
         value: "warehouse",
         desc: productsReceive.length > 0 ?
            <DataTable columns={columnFM.concat(actionWarehouse)} rows={productsReceive} /> :
            <div className='flex flex-col gap-3 items-center justify-center mt-10'>
               <img src={nodata_img} alt='' />
               Không có dữ liệu nào!
            </div>
      },
      {
         label: `Sản phẩm đang bán (${products.length})`,
         value: "products",
         desc: products.length > 0 ?
            <DataTable columns={columnTPT} rows={products} /> :
            <div className='flex flex-col gap-3 items-center justify-center mt-10'>
               <img src={nodata_img} alt='' />
               Không có dữ liệu nào!
            </div>
      },
   ]

   return (
      <div className='w-auto bg-white mx-5 px-5 py-2 mt-8 rounded-lg'>
         {isLoading && <Loading />}
         {isOpenModal && <SellProductModal setIsOpenModal={setIsOpenModal} uid={uid} getProductsReceived={getProductsReceived} getProducts={getProducts} />}
         <Tabs value={activeTab}>
            <TabsHeader
               className="rounded-none border-b border-blue-gray-50 bg-transparent p-0"
               indicatorProps={{ className: "bg-transparent border-b-2 border-gray-900 shadow-none rounded-none" }}>
               {data.map(({ label, value }) => (
                  <Tab key={value} value={value} onClick={() => setActiveTab(value)} className={activeTab === value ? "text-gray-900 border-b-2 border-green-600 " : ""} >
                     {label}
                  </Tab>
               ))}
            </TabsHeader>
            <TabsBody>
               {data.map(({ value, desc }) => (
                  <TabPanel key={value} value={value}>
                     {desc}
                  </TabPanel>
               ))}
            </TabsBody>
         </Tabs>
      </div>
   );
}

export default PurchaseTPT;

export const columnTPT = [
   {
      field: 'uid',
      headerName: 'ID',
      width: 20
   },
   {
      field: 'code',
      headerName: 'Mã sản phẩm',
      width: 80,
   },
   {
      field: 'name',
      headerName: 'Tên',
      width: 70,
   },
   {
      field: 'images',
      headerName: 'Hình ảnh',
      width: 120,
      renderCell: (params: any) => (
         <img className='rounded-full w-full h-full object-cover' src={params.row.images} alt="" />
      )
   },
   {
      field: 'price',
      headerName: 'Giá gốc',
      width: 90
   },
   {
      field: 'priceAgent',
      headerName: 'Giá bán',
      width: 90
   },
   {
      field: 'category',
      headerName: 'Loại',
      width: 120
   },
   {
      field: 'description',
      headerName: 'Mô tả',
      width: 90
   },
   {
      field: 'quantity',
      headerName: 'Số lượng',
      width: 80,
      renderCell: (params: any) => (
         <span>{params.row.quantity} hộp</span>
      )
   },
   {
      field: 'nsx',
      headerName: 'Ngày sản xuất',
      width: 110,
   },
   {
      field: 'hsd',
      headerName: 'Hạn sử dụng',
      width: 110,
   },
]
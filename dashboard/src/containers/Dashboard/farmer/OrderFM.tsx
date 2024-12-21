import React, { useState, useEffect } from 'react'
import DataTable from '../../../components/Dashboard/DataTable';
import { formatTime, formatToEth } from '../../../utils/function/format';
import SupplyChainContract from '../../../contracts/SupplyChainContract';
import StateProduct from '../../../utils/data/statesProduct';
import { ethers } from 'ethers';
import { useOutletContext } from 'react-router-dom';
import Swal from 'sweetalert2';
import Loading from '../../../components/Loading';
import { useSelector } from 'react-redux';
import { useStateContext } from '../../../contexts/ContextProvider';
import { SUPPLYCHAIN_ADDRESS, getAbiSupplyChain } from '../../../contracts/config';
import { Tabs, TabsHeader, TabsBody, Tab, TabPanel } from "@material-tailwind/react";

const nodata_img = require('../../../utils/images/no-data.jpg');

const OrderFM = () => {

   const { currentColor } = useStateContext();

   const { currentUser } = useSelector((state: any) => state.user);
   const [productsSold, setProductsSold] = useState<any>([]);

   const getProductsSold = async () => {
      try {
         const supplychainContract = new SupplyChainContract();
         const response = await supplychainContract.getProducts();
         console.log(response)
         const productFilted = response.filter((data: any) => (data.thirdPartyDetails.longitude !== "" && data.farmerDetails.factoryCode === currentUser?.code));
         const listProducts = [];
         for (let i = 0; i < productFilted.length; i++) {
            listProducts.push(convertObjectProduct(productFilted[i]));
         }
         setProductsSold(listProducts.reverse());
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
         category: data.productDetails.category,
         images: data.productDetails.images,
         description: data.productDetails.description,
         quantity: data.productDetails.quantity.toNumber(),
         temp: data.productDetails.temp,
         humidity: data.productDetails.humidity,
         date: data.productDetails.date.toNumber()
      }
   }

   useEffect(() => {
      if (currentUser?.code) {
         getProductsSold();
      }
   }, [currentUser?.code]);

   return (

      <div className='w-auto bg-white mx-5 px-5 py-5 mt-14 rounded-lg h-[550px]'>
         <div className='flex items-center justify-between'>
            <h3 className='text-444 text-xl font-medium mb-5'>Sản phẩm đã bán</h3>
         </div>
         {
            productsSold.length > 0 ? <DataTable columns={columnFM} rows={productsSold} /> :
               <div className='flex flex-col gap-3 items-center justify-center mt-10'>
                  <img src={nodata_img} />
                  Không có dữ liệu nào!
               </div>
         }
      </div>
   )
}

export default OrderFM;

export const columnFM = [
   {
      field: 'uid',
      headerName: 'ID',
      width: 40
   },
   {
      field: 'code',
      headerName: 'Mã sản phẩm',
      width: 100,
   },
   {
      field: 'name',
      headerName: 'Tên',
      width: 100,
   },
   {
      field: 'images',
      headerName: 'Hình ảnh',
      width: 130,
      renderCell: (params: any) => (
         <img className='rounded-full w-full h-full object-cover' src={params.row.images} alt="" />
      )
   },
   {
      field: 'price',
      headerName: 'Giá',
      width: 80,
      renderCell: (params: any) => (
         <span>{params.row.price} AGT</span>
      )
   },
   {
      field: 'category',
      headerName: 'Loại',
      width: 100
   },
   {
      field: 'description',
      headerName: 'Mô tả',
      width: 100
   },
   {
      field: 'quantity',
      headerName: 'Số lượng',
      width: 70,
      renderCell: (params: any) => (
         <span>{params.row.quantity} hộp</span>
      )
   },
   {
      field: 'nsx',
      headerName: 'Ngày sản xuất',
      width: 120,
   },
   {
      field: 'hsd',
      headerName: 'Hạn sử dụng',
      width: 120,
   },
]
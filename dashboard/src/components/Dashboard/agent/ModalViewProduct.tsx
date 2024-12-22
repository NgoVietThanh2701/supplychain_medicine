import React, { useEffect, useState } from 'react';
import { IoCloseCircleOutline } from 'react-icons/io5'
import { useStateContext } from '../../../contexts/ContextProvider';
import { apigetLocation } from '../../../services/factory';
import { formatTime, showShortAddress } from '../../../utils/function/format';
import { CiChat1, CiShop } from 'react-icons/ci';
import { apiGetInfoUser } from '../../../services/userServices';
const no_img = require('../../../utils/images/avatar.png');

const ModalViewProduct = ({ setIsOpenModal, product, handleBuyProduct }: any) => {

   const { currentColor } = useStateContext();

   const [info, setInfo] = useState<any>(null);
   const [location, setLocation] = useState("");

   const getInfoFactory = async () => {
      try {
         const responst = await apiGetInfoUser(product?.factoryDetails?.factoryCode);
         setInfo(responst.data.data);
      } catch (error: any) {
         console.log(error)
      }
   }


   const getLocation = async () => {
      try {
         if (info?.longitude && info?.latitude) {
            const response = await apigetLocation(parseInt(info.latitude), parseInt(info.longitude));
            setLocation(response);
            return response
         }
      } catch (error) {
         console.log(error)
      }
   }

   useEffect(() => {
      getInfoFactory();
      getLocation();
   }, [info?.longitude])

   return (
      <div className='bg-half-transparent nav-item w-screen fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center'>
         <div className='bg-white w-[670px] relative group rounded-md py-5 px-6 flex flex-col gap-2.5 mb-16'>
            <button className='absolute top-2 right-2 text-444' onClick={() => setIsOpenModal(false)}>
               <IoCloseCircleOutline size={24} />
            </button>
            <h3 className='text-333 font-medium text-xl'>Thông tin sản phẩm</h3>
            <div className='flex gap-5'>
               <div className='w-2/5 h-48'>
                  <img src={product.images} alt="" className='w-full h-full object-cover' />
               </div>
               <div className='w-3/5 flex flex-col gap-1'>
                  <span className='line-clamp-3 text-444'>[{product.description}]</span>
                  <h3 className='text-333 text-xl font-semibold'>{product.name}</h3>
                  <span className='text-green font-bold text-lg py-1'>Giá: {product.price} AGT</span>
                  <span className='text-444'>Số lượng: {product.quantity} Kg</span>
                  <button onClick={() => handleBuyProduct(product.uid, product.price)} className={`text-white rounded-md px-3 py-1 mt-2 w-24 mx-auto`} style={{ backgroundColor: currentColor }} >Thu mua</button>
               </div>
            </div>
            <div className='flex bg-[#F5F5F5] py-3 px-5 gap-5 rounded-md'>
               <div className='w-14 h-14'>
                  <img src={no_img} className='w-full h-full object-cover rounded-full' alt="" />
               </div>
               <div className='flex flex-col gap-1 justify-around'>
                  <h3 className='text-333 text-[15px]'>Người bán: <span className='font-semibold text-base'> {info?.name} </span>[{showShortAddress(product?.factoryDetails.factory, 10)}]</h3>
                  <div className='flex items-center gap-3'>
                     <button className='inline-flex items-center gap-1 text-333 border border-green-300 px-2 py-1 rounded-md text-[13px]'>
                        <CiChat1 />Chat ngay </button>
                     <button className='inline-flex items-center gap-1 text-333 px-2 py-1 rounded-md text-[13px]'>
                        <CiShop />{location} </button>
                  </div>
               </div>
            </div>
            <div className='flex flex-col text-444 gap-[6px]'>
               <h3 className='text-[#616161] p-2 rounded-md'>CHI TIẾT SẢN PHẨM</h3>
               <div className='flex items-center gap-12 pl-2'>
                  <span> Ngày sản xuất: {product?.nsx} </span>
                  <span> Hạn sử dụng sản xuất: {product?.hsd}</span>
               </div>
               <span className='pl-2'>Loại: {product.category}</span>
            </div>
         </div>
      </div>
   )
}

export default ModalViewProduct
import { useState, useEffect } from 'react';
import { IoCloseCircleOutline } from "react-icons/io5";
import InputForm from '../../Public/InputForm';
import { BsCloudArrowUp } from "react-icons/bs";
import { WiHumidity } from "react-icons/wi";
import { CiLocationOn } from "react-icons/ci";
import { LiaTemperatureLowSolid } from "react-icons/lia";
import { apigetCategories } from '../../../services/factory';
import validate from '../../../utils/function/validateField';
import axios from 'axios';
import Loading from '../../Loading';
import { ethers } from 'ethers';
import { useOutletContext } from 'react-router-dom';
import SupplyChainContract from '../../../contracts/SupplyChainContract';
import { capitalizeFirstLetter } from '../../../utils/function/format';
import AutoCompleteMap from '../../AutoCompleteMap';
import { useSelector } from 'react-redux';
import { SUPPLYCHAIN_ADDRESS, getAbiSupplyChain } from '../../../contracts/config';
import { useStateContext } from '../../../contexts/ContextProvider';

const { v4: uuidv4 } = require('uuid');
const noImg = require('../../../utils/images/no-data.jpg');
const pinataConfig = {
   root: 'https://api.pinata.cloud',
   headers: {
      'pinata_api_key': process.env.REACT_APP_PINATA_APIKEY,
      'pinata_secret_api_key': process.env.REACT_APP_PINATA_SECRETKEY
   }
};

const HarvestedModal = ({ setIsOpenModal, getProducts }: any) => {

   const { currentColor } = useStateContext();

   const web3Provider: ethers.providers.Web3Provider = useOutletContext();
   const { currentUser } = useSelector((state: any) => state.user);

   const [invalidFields, setInvalidFields] = useState<any>([]);
   const [errs, setErrs] = useState(false);
   const [isLoading, setIsLoading] = useState(false);
   const [categories, setCategories] = useState([]);
   const [preview, setPreview] = useState("");
   const [payload, setPayload] = useState({
      name: '',
      price: '',
      category: '',
      image: null,
      descriptionProduct: '',
      quantity: '',
   });


   console.log(payload);

   const loadImage = (e: any) => {
      const image = e.target.files[0];
      setPayload((prev) => ({ ...prev, image: image }));
      setPreview(URL.createObjectURL(image));
   }

   const getCategories = async () => {
      try {
         const response = await apigetCategories();
         setCategories(response.data.data);
      } catch (error) {
         console.log(error)
      }
   }

   useEffect(() => {
      getCategories();
   }, []);

   async function handleHarvested() {
      let invalids = validate(payload, setInvalidFields);
      try {
         if (invalids === 0 && payload.image) {
            try {
               setIsLoading(true);
               const formData = new FormData();
               formData.append('file', payload.image);
               formData.append('pinataOptions', JSON.stringify({ cidVersion: 1 }));
               formData.append('pinataMetadata', JSON.stringify({ name: payload.image['name'] }));
               const url = `${pinataConfig.root}/pinning/pinFileToIPFS`;
               const response = await axios({
                  method: 'post',
                  url: url,
                  data: formData,
                  headers: pinataConfig.headers
               });
               const urlImage = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
               const supplychainContract = new SupplyChainContract(web3Provider);
               await supplychainContract.productionProduct(capitalizeFirstLetter(payload.name), uuidv4(), Number.parseFloat(payload.price), payload.category, urlImage, payload.descriptionProduct, Number.parseFloat(payload.quantity), "2/12/2024", "3/4/2035", currentUser?.code);
               listenEvent();
            } catch (error) {
               console.log(error)
            }
         } else {
            setErrs(true);
         }
      } catch (error) {

      }
   }

   const listenEvent = () => {
      let contract = new ethers.Contract(SUPPLYCHAIN_ADDRESS, getAbiSupplyChain(), web3Provider);
      contract.once("Production", (uid) => {
         setIsLoading(false);
         setIsOpenModal(false);
         getProducts();
      })
   }

   return (
      <div className='bg-half-transparent z-10 w-screen fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center'>
         {isLoading && <Loading />}
         <div className='bg-white w-[720px] relative group rounded-md py-3 px-5 flex flex-col gap-3'>
            <button className='absolute top-2 right-2 text-444' onClick={() => setIsOpenModal(false)}>
               <IoCloseCircleOutline size={24} />
            </button>
            <h3 className='text-333 font-medium text-xl'>Thêm sản phẩm</h3>
            <div className='flex gap-3'>
               <InputForm
                  setInvalidFields={setInvalidFields}
                  invalidFields={invalidFields}
                  label='Nhập tên sản phẩm'
                  value={payload.name}
                  setValue={setPayload}
                  keyPayload='name'
                  setErrs={setErrs}
               />
               <div className='w-[300px]'>
                  <select id="categories" onChange={(e) => setPayload((prev: any) => ({ ...prev, category: e.target.value }))}
                     className="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-color appearance-none focus:outline-none focus:ring-0 focus:border-color peer">
                     <option value=''>Chọn phân loại</option>
                     {categories && categories.map((cate: any, index: any) => (
                        <option key={index} value={cate.name}>{cate.name}</option>
                     ))}

                  </select>
               </div>
            </div>
            <div className='flex justify-between gap-3'>
               <InputForm
                  setInvalidFields={setInvalidFields}
                  invalidFields={invalidFields}
                  label='Nhập giá sản phẩm (AGT token)'
                  value={payload.price}
                  setValue={setPayload}
                  keyPayload='price'
                  type='number'
                  setErrs={setErrs}
               />
               <InputForm
                  setInvalidFields={setInvalidFields}
                  invalidFields={invalidFields}
                  label='Nhập số lượng (Kg)'
                  value={payload.quantity}
                  setValue={setPayload}
                  keyPayload='quantity'
                  type='number'
                  setErrs={setErrs}
               />
            </div>
            <div>
               <label htmlFor="description" className="block mb-2 pl-1 text-sm font-medium text-666">Nhập mô tả</label>
               <textarea id="description" rows={2} onChange={(e) => setPayload((prev: any) => ({ ...prev, descriptionProduct: e.target.value }))}
                  className="block p-2.5 w-full text-sm text-333 bg-gray-50 rounded-lg outline-none border-color focus:border-[#3B71CA] border-1" placeholder="Nhập thông tin mô tả sản phẩm tại đây..."></textarea>
            </div>
            <div className='flex justify-center gap-1'>
               <div className='w-2/5 flex flex-col items-center'>
                  <div className='w-full h-[220px] p-2'><img src={payload.image ? preview : noImg} alt="" className='w-full h-full object-cover' /></div>
                  <input type="file" id='img' onChange={loadImage} style={{ display: "none" }} />
                  <label className='text-333 mt-1 inline-flex items-center gap-2' htmlFor="img">Chọn file <BsCloudArrowUp size={20} /></label>
                  {invalidFields.length > 0 && invalidFields.some((i: any) => i.name === 'image') &&
                     <small className='text-red-700 italic'>
                        {invalidFields.find((i: any) => i.name === 'image')?.message}
                     </small>
                  }
               </div>
               <div className='w-2/5'>
                  dasdsasa
               </div>
            </div>
            {errs && <span className='text-red-700 text-sm mx-auto italic'>Vui lòng cung cấp dầy đủ thông tin!</span>}
            <button onClick={handleHarvested}
               className='text-white mx-auto px-4 py-2 mt-1 rounded-md' style={{ backgroundColor: currentColor }}>
               Thêm sản phẩm
            </button>
         </div>
      </div>
   )
}

export default HarvestedModal
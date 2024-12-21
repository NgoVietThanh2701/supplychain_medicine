import React, { useState, useEffect } from 'react'
import ProductTPT from '../../../components/Dashboard/thirdparty/ProductTPT'
import Pagination from '../../../components/Pagination'
import SupplyChainContract from '../../../contracts/SupplyChainContract'
import StateProduct from '../../../utils/data/statesProduct'
import { formatToEth } from '../../../utils/function/format'
import Loading from '../../../components/Loading'
const nodata_img = require('../../../utils/images/no-data.jpg');

const ShopProductTPT = () => {

   const [products, setProducts] = useState<any>([]);

   const getProducts = async () => {
      try {
         const supplychainContract = new SupplyChainContract();
         const response = await supplychainContract.getProducts();
         const productFilted = response.filter((data: any) => data.productState === StateProduct.Production);
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
         factoryDetails: data.factoryDetails,
         productState: data.productState,
         name: data.productDetails.name,
         code: data.productDetails.code,
         price: formatToEth(data.productDetails.price),
         category: data.productDetails.category,
         images: data.productDetails.images,
         description: data.productDetails.description,
         quantity: data.productDetails.quantity.toNumber(),
         nsx: data.productDetails.nsx,
         hsd: data.productDetails.hsd
      }
   }

   useEffect(() => {
      getProducts();
   }, []);

   return (
      <div>
         {products.length > 0 ? <Pagination itemsPerPage={10} data={products} Component={ProductTPT} getProducts={getProducts} /> :
            <div className='flex flex-col gap-3 items-center justify-center mt-[170px]'>
               <img src={nodata_img} />
               Không có sản phẩm nào!
            </div>}
      </div>
   )
}

export default ShopProductTPT
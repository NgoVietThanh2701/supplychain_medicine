import { ethers } from "ethers";
import BaseInterface from "./interfaces/BaseInterface";
import { rpcProvider, SUPPLYCHAIN_ADDRESS, getAbiSupplyChain } from "./config";

export default class SupplyChainContract extends BaseInterface {
   constructor(provider?: ethers.providers.Web3Provider) {
      super(provider || rpcProvider, SUPPLYCHAIN_ADDRESS, getAbiSupplyChain());
      if (!provider) {
         this._contract = new ethers.Contract(this._contractAddress, this._abi, rpcProvider);
      }
   }

   async addFactory(address: string) {
      await this._contract.addFactory(address, this._option);
   }

   async addCustomer(address: string) {
      await this._contract.addCustomer(address, this._option);
   }

   async addDeliveryHub(address: string) {
      await this._contract.addDeliveryHub(address, this._option);
   }

   async addAgent(address: string) {
      await this._contract.addAgent(address, this._option);
   }

   // step 1: production
   async productionProduct(name: string, code: string, price: number, category: string, images: string, description: string, quantity: number, nsx: string, hsd: string, factoryCode: string) {
      await this._contract.productionProduct(name, code, this._parseToEth(price), category, images, description, quantity, nsx, hsd, factoryCode, this._option);
   }

   // step 2: third party purschar product
   async purchaseByAgent(uid: number, agentCode: string) {
      await this._contract.purchaseByAgent(uid, agentCode, this._option);
   }

   // step 3: thirdparty -> add price for sold product
   async sellByAgent(uid: number, price: number) {
      await this._contract.sellByAgent(uid, this._parseToEth(price), this._option);
   }

   // step 4: customer buy product
   async purchaseByCustomer(uid: number, feeShip: number, addressShip: string, customerCode: string) {
      await this._contract.purchaseByCustomer(uid, this._parseToEth(feeShip), addressShip, customerCode, this._option);
   }

   // step 5: agent ship product
   async shipByAgent(uid: number) {
      await this._contract.shipByAgent(uid, this._option);
   }

   // step 6: delivery hub receive product
   async receiveByDeliveryHub(uid: number, deliveryHubCode: string) {
      await this._contract.receiveByDeliveryHub(uid, deliveryHubCode, this._option);
   }
   // step 7: delivery ship product to customer
   async shipByDeliveryHub(uid: number) {
      await this._contract.shipByDeliveryHub(uid, this._option);
   }

   // step 8: customer confirm receive product
   async receiveByCustomer(uid: number) {
      await this._contract.receiveByCustomer(uid, this._option);
   }

   async getProductByCode(code: string) {
      const product = await this._contract.getProductByCode(code, this._option);
      return product;
   }

   async getProductCount() {
      const count = await this._contract.getProductCount();
      return count._toNumber();
   }

   async getProducts() {
      const products = await this._contract.getProducts();
      return products;
   }
}
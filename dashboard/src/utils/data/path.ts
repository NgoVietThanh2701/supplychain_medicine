const path = {
   // root dashboard
   DASHBOARD: '/dashboard',
   // admin
   ADMIN_STATISTICAL: 'admin/statistical',
   ADMIN_REQUEST: 'admin/request',
   ADMIN_USERS: 'admin/users',
   // farmer
   FACTORY_STATISTICAL: 'factory/statistical',
   FACTORY_PRODUCT: 'factory/products',
   FACTORY_ORDER: 'factory/orders',
   FACTORY_CATEGORY: 'factory/categories',
   // agent
   AGENT_STATISTICAL: 'agent/statistical',
   AGENT_SHOP: 'agent/shop',
   AGENT_PURCHASE_ORDER: 'agent/purchase-order',
   AGENT_ORDERED: 'agent/ordered',
   // delivery hub
   DELIVERYHUB_STATISTICAL: 'deliveryhub/statistical',
   DELIVERYHUB_RECEIVE: 'deliveryhub/received-product',

   // -----------------------------------------
   LOGIN: '/login/:role',
   REGISTER: '/register/:role',
   VERIFY_OTP: '/register/:role/:email/verify-otp',
   HOME: '/*',
   SHOP: '/shop',
   SINGLE_PRODUCT: '/single-product/:code',
   BUY_TOKEN: '/buy-token',
   PURCHARSE_FORM: '/purchase-form'
}

export default path
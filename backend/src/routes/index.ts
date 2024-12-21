import { Express } from "express";
import routerAuth from './authRoute';
import routerAdmin from './adminRoute';
import routerCategory from './categoryRoute';
import routerStatistical from './statisticalRoute'

const initRoutes = (app: Express) => {
   app.use('/api/v1/auth', routerAuth);
   app.use('/api/v1/admin', routerAdmin);
   app.use('/api/v1/category', routerCategory);
   app.use('/api/v1/statistical', routerStatistical);
}

export default initRoutes;
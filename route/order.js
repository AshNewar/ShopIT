import express from "express";
import { adminAuthenticated, isAuthenticated } from "../middlewares/auth.js";
import { adminStats, getAdminOrders, myOrder, orderDetails, orderPlaced, orderPlacedOnline, paymentVerification, processOrder } from "../controllers/orderFunc.js";

const router2 = express.Router();

//Placing Order
router2.post("/createorder",isAuthenticated, orderPlaced);
router2.post("/createorderonline",isAuthenticated,orderPlacedOnline);

//Online Payment Verify
router2.post("/paymentVerify",isAuthenticated,paymentVerification);

//
router2.get("/myorder",isAuthenticated,myOrder);

//
router2.get("/order/:id",isAuthenticated,orderDetails);

//Admin Check 
router2.get("/admin/orders",isAuthenticated,adminAuthenticated, getAdminOrders);

//
router2.get("/admin/order/:id",isAuthenticated,adminAuthenticated, processOrder);

//Admin Stats
router2.get("/admin/stats",isAuthenticated,adminAuthenticated,adminStats);
export default router2;

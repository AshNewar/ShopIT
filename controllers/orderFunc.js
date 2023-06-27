import { instance } from "../app.js";
import { TryCatch } from "../middlewares/error.js";
import User from "../models/models.js";
import { Order } from "../models/order.js";
import { Payment } from "../models/payment.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import crypto from "crypto";

export const orderPlaced = TryCatch(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingCharges,
    totalAmount,
  } = req.body;

  const user = req.user._id;
  const orderdetails = {
    shippingInfo,
    orderItems,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingCharges,
    totalAmount,
    user,
  };

  await Order.create(orderdetails);

  res.status(201).json({
    success: true,
    msg: "Order Confirmed",
  });
});

export const orderPlacedOnline = TryCatch(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingCharges,
    totalAmount,
  } = req.body;

  const user = req.user._id;
  const orderdetails = {
    shippingInfo,
    orderItems,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingCharges,
    totalAmount,
    user,
  };
  var options = {
    amount: Number(totalAmount) * 100, // amount in the smallest currency unit
    currency: "INR",
  };
  const receipt = await instance.orders.create(options);

  res.status(201).json({
    success: true,
    msg: "Online Order Confirmed",
    orderdetails,
    receipt,
  });
});

export const paymentVerification = TryCatch(async (req, res, next) => {
  const {
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
    orderDetails,
  } = req.body;

  const word = razorpay_order_id + "|" + razorpay_payment_id;
  const generatedSign = crypto
    .createHmac("sha256", process.env.RAZOR_SECRET)
    .update(word)
    .digest("hex");

  const verify = generatedSign === razorpay_signature;
  if (verify) {
    const payment = await Payment.create({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    await Order.create({
      ...orderDetails,
      paymentInfo: payment._id,
      paidAt: new Date(Date.now()),
    });
    res.status(201).json({
      success: true,
      msg: `Order Placed Payment Id :${payment._id}`,
    });
  } else {
    return next(new ErrorHandler("Payment Failed", 404));
  }
});

export const myOrder = TryCatch(async (req, res, next) => {
  const order = await Order.find({ user: req.user._id }).populate("user", "name");

  res.status(201).json({
    success: true,
    order,
  });
});

export const orderDetails = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name");

    if (!order) return next(new ErrorHandler("Invalid OrderId", 401));

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getAdminOrders = TryCatch(async (req, res, next) => {
  const orders = await Order.find({});

  res.status(200).json({
    success: true,
    orders,
  });
});

export const processOrder = TryCatch(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) return next(new ErrorHandler("Invalid OrderId", 404));

  if (order.orderStatus === "Preparing") order.orderStatus = "Shipping";
  else if (order.orderStatus === "Shipping") {
    order.orderStatus = "Delivered";
    order.deliveredAt = new Date(Date.now());
  } else if (order.orderStatus === "Delivered")
    return next(new ErrorHandler("Order Delivered Already"));
  await order.save();

  res.status(200).json({
    success: true,
    msg: "Status Updated",
  });
});

export const adminStats = TryCatch(async (req, res, next) => {
  const totalUser = await User.countDocuments();
  const order = await Order.find({});
  let preparingItem = order.filter((i) => i.orderStatus === "Preparing");
  let shippingItem = order.filter((i) => i.orderStatus === "Shipping");
  let deliveredItem = order.filter((i) => i.orderStatus === "Delivered");

  var totalIncome = 0;
  order.forEach((i) => {
    totalIncome += i.totalAmount;
  });

  res.status(200).json({
    success: true,
    totalUser,
    totalIncome,
    orderCount: {
      total:order.length,
      preparing:preparingItem.length,
      shipping:shippingItem.length,
      delivered:deliveredItem.length,
    },
  });
});

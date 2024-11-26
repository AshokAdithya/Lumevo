import DocumentTypes from "../models/DocumentTypes.js";
import Razorpay from "razorpay";
import crypt from "crypto";
import StudentApply from "../models/StudentApply.js";
import Transaction from "../models/Transaction.js";
import Mailer from "../utils/Mailer.js";
import User from "../models/User.js";
import Profile from "../models/Profile.js";

export const getDetails = async (req, res) => {
  try {
    const applyId = req.query.applyId;

    const documentApply = await StudentApply.findById(applyId);

    const documentType = documentApply.type;

    const document = await DocumentTypes.findOne({ type: documentType });

    const { type, price } = document;
    res.status(200).send({ type: type, price: price });
  } catch (err) {
    return res.status(500).send("Internal Server Error");
  }
};

export const applyOrders = async (req, res) => {
  try {
    const applyId = req.params.applyId;

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    const options = {
      amount: req.body.amount * 100,
      currency: "INR",
      receipt: crypt.randomBytes(10).toString("hex"),
    };

    instance.orders.create(options, async (error, order) => {
      if (order) {
        const studentOrder = await StudentApply.findByIdAndUpdate(applyId, {
          orderId: order.id,
        });
      }
      if (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error");
      }
      return res.status(200).send({ data: order });
    });
  } catch (err) {
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

//From Client
// export const verifyPayment = async (req, res) => {
//   try {
//     const {
//       razorpay_order_id,
//       razorpay_payment_id,
//       razorpay_signature,
//       applyId,
//       amount,
//     } = req.body;
//     const sign = razorpay_order_id + "|" + razorpay_payment_id;
//     const expectedSign = crypt
//       .createHmac("sha256", process.env.RAZORPAY_SECRET)
//       .update(sign.toString())
//       .digest("hex");

//     if (razorpay_signature === expectedSign) {
//       const ApplyOrder = await StudentApply.findById(applyId);
//       ApplyOrder.paymentStatus = "completed";
//       const userId = ApplyOrder.userId;
//       await ApplyOrder.save();

//       const TransactionOrder = new Transaction({
//         userId: userId,
//         applyId: applyId,
//         amount: amount / 100,
//         status: "completed",
//         orderId: razorpay_order_id,
//         paymentId: razorpay_payment_id,
//       }).save();

//     return res
//       .status(200)
//       .send({ success: true, message: "Payment verified successfully" });
//     } else {
//       return res
//         .status(400)
//         .send({ success: false, message: "Invalid Signature Sent!" });
//     }
//   } catch (err) {
//     res.status(500).send({ message: "Internal Server Error" });
//   }
// };

//From Web Hook
export const verification = async (req, res) => {
  const secret = "HACKMEIMPOSTER";

  const shasum = crypt.createHmac("sha256", secret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");

  res.status(200).send({ success: true });

  if (digest === req.headers["x-razorpay-signature"]) {
    const {
      payload: {
        payment: {
          entity: { order_id, id: payment_id, amount },
        },
      },
    } = req.body;

    const applyOrder = await StudentApply.findOne({ orderId: order_id });
    applyOrder.paymentStatus = "completed";
    applyOrder.paymentDate = new Date();
    const userId = applyOrder.userId;
    await applyOrder.save();

    const TransactionOrder = new Transaction({
      userId: userId,
      applyId: applyOrder._id,
      amount: amount / 100,
      status: "completed",
      orderId: order_id,
      paymentId: payment_id,
    }).save();

    const userDetails = await Profile.findOne({ user: userId });

    const email = userDetails.email;
    const subject = "Payment Confirmation";
    let text = `Your payment Id: ${payment_id} has been successfully completed.\n\n`;

    const uploadedFiles = await StudentApply.findById(applyOrder._id);

    if (uploadedFiles.template) {
      text += "\n\nTemplate Files:\n";
      text += `- ${uploadedFiles.template.fileName}\n`;
    }

    if (uploadedFiles.additionalFiles) {
      text += "\n\\n Additional Files:\n";
      uploadedFiles.additionalFiles.forEach((file) => {
        text += `- ${file.fileName}\n`;
      });
    }

    await Mailer(email, subject, text);
  }
};

export const paymentStatus = async (req, res) => {
  try {
    const applyId = req.query.applyId;

    const applyOrder = await StudentApply.findById(applyId);

    const status = applyOrder.paymentStatus;

    if (status === "pending") {
      res.status(200).send({ success: true, message: "Payment need to done" });
    } else {
      res.status(200).send({ success: false, message: "Payment Done already" });
    }
  } catch (err) {
    res.status(500).send({ success: false, message: "Internal Server Error" });
  }
};

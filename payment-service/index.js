require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 8084;

/* ========== CONNECT MONGODB ========== */
mongoose.connect(process.env.MONGODB_CONNECTIONSTRING)
.then(() => console.log("MongoDB connected (Payment Service)"))
.catch(err => console.log(err));

/* ========== SCHEMA ========== */
const paymentSchema = new mongoose.Schema({
    bookingId: String,
    amount: Number,
    status: String, // SUCCESS / FAILED
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Payment = mongoose.model("Payment", paymentSchema);

/* ========== RANDOM RESULT ========== */
function randomPaymentResult() {
    return Math.random() > 0.5;
}

/* ========== POST PAYMENT ========== */
app.post("/payments", async (req, res) => {
    try {
        const { bookingId, amount } = req.body;

        if (!bookingId || !amount) {
            return res.status(400).json({
                message: "Missing bookingId or amount"
            });
        }

        const success = randomPaymentResult();

        const payment = new Payment({
            bookingId,
            amount,
            status: success ? "SUCCESS" : "FAILED"
        });

        await payment.save();

        console.log("Payment saved:", payment);

        res.json({
            message: "Payment processed",
            payment
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server error"
        });
    }
});

/* ========== GET PAYMENTS (TEST) ========== */
app.get("/payments", async (req, res) => {
    const payments = await Payment.find();
    res.json(payments);
});

app.listen(PORT, () => {
    console.log(`Payment Service running on port ${PORT}`);
});
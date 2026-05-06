require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 8083;

/* ========== 1. CONNECT MONGODB ========== */
mongoose.connect(process.env.MONGODB_CONNECTIONSTRING)
.then(() => console.log("MongoDB connected"))
.catch(err => console.log("MongoDB error:", err));

/* ========== 2. CREATE SCHEMA ========== */
const bookingSchema = new mongoose.Schema({
    userId: String,
    tourId: String,
    status: {
        type: String,
        default: "CREATED"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Booking = mongoose.model("Booking", bookingSchema);

/* ========== 3. API CREATE BOOKING ========== */
app.post("/bookings", async (req, res) => {
    try {
        const { userId, tourId } = req.body;

        if (!userId || !tourId) {
            return res.status(400).json({
                message: "Missing userId or tourId"
            });
        }

        const booking = new Booking({
            userId,
            tourId
        });

        await booking.save();

        console.log("Saved to MongoDB:", booking);

        res.json({
            message: "Booking saved successfully",
            booking
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server error"
        });
    }
});

/* ========== 4. GET ALL (TEST) ========== */
app.get("/bookings", async (req, res) => {
    const bookings = await Booking.find();
    res.json(bookings);
});

app.listen(PORT, () => {
    console.log(`Booking Service running on port ${PORT}`);
});
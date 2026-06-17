import mongoose from "mongoose";

const deliverySchema = new mongoose.Schema(
    {
        location: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        label: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        note: {
            type: String,
            trim: true,
            default: "",
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        active: {
            type: Boolean,
            default: true,
        },
        parentVendor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            sparse: true,
            index: true
        },
    },
    {
        timestamps: true,
    }
);

const Delivery = mongoose.model("Delivery", deliverySchema);
export default Delivery;
import mongoose from "mongoose";
import softDelete from "mongoose-delete";

const PackageSchema = new mongoose.Schema(
  {
    name: String,
    type: {
      type: String,
      enum: ["dedicated", "shared"],
      required: true,
    },
    bandwidthType: {
      type: String,
      enum: ["limited", "unlimited"],
    },
    bandwidth: {
      type: Number,
    },
    upToBandwidth: {
      type: Number,
    },
    price: {
      type: Number,
      required: true,
    },
    plusPrice: {
      type: Number,
    },
    lifeSpan: {
      type: Number,
      required: true,
    },
    priority: {
      type: Number,
      required: true,
      default: 1,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Category",
    },
    province: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Province",
    },
    capacity: {
      type: Number,
    },
    freeTimeInterval: {
      from: String,
      to: String
    },
    dailyVolume: Number,
    speedAfterDailyVolume: Number,

    nightProps: {           // Free nightly speed
      bandwidth: Number,
      from: String,
      to: String
    },
    dailySpeed: {
      bandwidth: Number,
      from: String,
      to: String
    },
    nightlySpeed: {
      bandwidth: Number,
      from: String,
      to: String
    },
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    updaterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    }
  },
  {
    timestamps: true,
  }
);
PackageSchema.index({
  "name.*": "text",
});

PackageSchema.plugin(softDelete, {
  deletedBy: true,
  deletedAt: true,
  overrideMethods: true,
});

const Package = mongoose.model("Package", PackageSchema);

export default Package;

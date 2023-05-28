import mongoose from "mongoose";
import { accessibleRecordsPlugin } from "@casl/mongoose";

const ProvinceSchema = new mongoose.Schema({
    name: {
        fa: String,
        en: String,
        ps: String
    },
    creatorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
    },
    updaterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
    },
},
    {
        timestamps: true,
    }
);

ProvinceSchema.plugin(accessibleRecordsPlugin);

const Province = mongoose.model("Province", ProvinceSchema);

export default Province;

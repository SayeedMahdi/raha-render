import asyncHandler from "express-async-handler";
import JobRequest from "../../models/JobRequest.js";
import mongoose from "mongoose";

const JobRequestController = {
    /** 
     * @desc    Fetch Job Requests
     * @route   GET /api/v1/admin/request/job
     * @access  Public
     */
    getRequests: asyncHandler(async (req, res, next) => {
        const jobs = await JobRequest.find().sort({ createdAt: -1 })

        res.json(jobs)
    }),

    /** 
     * @desc    Fetch Job Single Request
     * @route   GET /api/v1/admin/request/job
     * @access  Public
     */
    getRequest: asyncHandler(async ({ user, params: { id }, t }, res, next) => {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next();
        }

        const jobRequest = await JobRequest.findOne({ _id: id })

        if (!jobRequest) {
            res.status(400);
            throw new Error(t("not-found", { ns: 'validations', key: t('request') }));
        }

        res.json(jobRequest);
    }),

    /** 
     * @desc    Change State of Request
     * @route   PUT /api/v1/admin/request/job/:id/change-state
     * @access  Public
     */
    changeState: asyncHandler(async (req, res, next) => {
        const { user, params: { id }, body } = req;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next();
        }

        const jobRequest = await JobRequest.findOneAndUpdate({ _id: id }, {
            status: body.status,
            updaterId: user.id
        }, { new: true });

        if (!jobRequest) {
            res.status(400);
            throw new Error(t("not-found", { ns: 'validations', key: t('request') }));
        }

        res.json(jobRequest);
    }),
}

export default JobRequestController;
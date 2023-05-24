import asyncHandler from "express-async-handler";
import { execShellCommand } from '../../utils/execShell.js'


const requestService = asyncHandler(async (req, res, next) => {
    const speedTest = await execShellCommand('fast --upload --json');

    res.status(200).json(JSON.parse(speedTest))
})

export { requestService }

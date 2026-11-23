const express = require("express");
const HTTP_STATUS = require("../constants/httpStatus");

const router = express.Router();

/**
 * Router: /health
 * A small check so you can confirm the process is running
 * without calling the external weather service.
 */

/**
 * @openapi
 * /health:
 *   get:
 *     tags:
 *       - Health
 *     summary: Check that the API process is running
 *     responses:
 *       200:
 *         description: Server is up
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Weather API is running
 */
router.get("/", (req, res) => {
    res.status(HTTP_STATUS.OK).json({
        status: "success",
        message: "Weather API is running"
    });
});

module.exports = router;

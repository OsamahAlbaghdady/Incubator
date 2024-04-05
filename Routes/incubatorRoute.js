// routes/incubator.js

const express = require('express');
const router = express.Router();
const incubatorController = require('../Controllers/incubatorController.js');
const authenticateToken = require('../Middlewares/auth');
const {  validateIncubator, validate } = require('../Middlewares/validateIncubator');



// write swagger documentation for the createIncubatorDevice with body { deviceId }
/**
 * @swagger
 * /api/incubator/createDevice:
 *   post:
 *     summary: Create a new incubator device
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               DeviceId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Incubator device created successfully
 */
router.post('/incubator/createDevice', authenticateToken(['admin']), incubatorController.createIncubatorDevice);



/**
 * @swagger
 * /api/incubator/create:
 *   post:
 *     summary: Create a new incubator
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               BabyName:
 *                 type: string
 *               BabyAge:
 *                 type: integer 
 *               ParentName:
 *                 type: string
 *               TimeOfRelease:
 *                 type: string
 *                 format: date-time
 *               Gender:
 *                 type: string
 *               MedicalCondition:
 *                 type: string
 *               PhoneNumber:
 *                 type: string
 *               Email:
 *                 type: string
 *               Password:
 *                 type: string
 *               Id:
 *                type: string
 * 
 *     responses:
 *       200:
 *         description: Incubator created successfully
 */
router.post('/incubator/create', authenticateToken(['admin']), validateIncubator, validate, incubatorController.createIncubator);


// write swagger documentation for the following routes
/**
 * @swagger
 * /api/incubator/all:
 *   get:
 *     summary: Get all incubators
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Get all incubators
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal server error
 *  
    */
router.get('/incubator/all', authenticateToken(['admin']), incubatorController.getAllIncubators);



// get by id document for the following routes
/**
 * @swagger
 * /api/incubator/{id}:
 *   get:
 *     summary: Get incubator by id
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Get incubator by id
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal server error
 */
router.get('/incubator/:id', authenticateToken(['admin']), incubatorController.getIncubator);


/**
 * @swagger
 * /api/incubator/update/{id}:  
 *   put:
 *     summary: Update incubator by id
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               BabyName:
 *                 type: string
 *               BabyAge:
 *                 type: string
 *               ParentName:
 *                 type: string
 *               TimeOfRelease:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Incubator updated successfully
 */

router.put('/incubator/update/:id', authenticateToken(['admin']), incubatorController.updateIncubator);

/**
 * @swagger
 * /api/incubator/delete/{id}:
 *   delete:
 *     summary: Delete incubator by id
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Incubator deleted successfully
 */

router.delete('/incubator/delete/:id', authenticateToken(['admin']), incubatorController.deleteIncubator);



// swagger documentation for the following routes
/**
 * @swagger
 * /api/incubator:
 *   get:
 *     summary: Get all incubators belonging to a user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Get all incubators belonging to a user
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal server error
 */
router.get('/incubator', authenticateToken(['user']), incubatorController.getMineIncubators);


/**
 * @swagger
 * /api/incubator/de-active/{id}:
 *   patch:
 *     summary: Active or inactive incubator
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Incubator active or inactive
 */

router.patch('/incubator/de-active/:id', authenticateToken(['admin']), incubatorController.deActivateIncubator);


module.exports = router;
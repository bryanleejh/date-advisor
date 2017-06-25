const express = require('express')
const router = express.Router();
const passport = require('passport');
const passportConfig = require('../config/passport');
/**
 * Controllers (route handlers).
 */
const homeController = require('../controllers/home');
const userController = require('../controllers/user');
const activityController = require('../controllers/activity');

/**
 * Primary app routes.
 */
router.get('/', homeController.index);
router.post('/create', activityController.createActivity);
router.get('/getactivities', activityController.getActivities);
router.put('/editactivities/', activityController.editActivity);
router.delete('/deleteactivities', activityController.deleteActivity);
router.get('/login', userController.getLogin);
router.post('/login', userController.postLogin);
router.get('/logout', userController.logout);
router.get('/forgot', userController.getForgot);
router.post('/forgot', userController.postForgot);
router.get('/reset/:token', userController.getReset);
router.post('/reset/:token', userController.postReset);
router.get('/signup', userController.getSignup);
router.post('/signup', userController.postSignup);
router.get('/account', passportConfig.isAuthenticated, userController.getAccount);
router.post('/account/profile', passportConfig.isAuthenticated, userController.postUpdateProfile);
router.post('/account/password', passportConfig.isAuthenticated, userController.postUpdatePassword);
router.post('/account/delete', passportConfig.isAuthenticated, userController.postDeleteAccount);
router.get('/account/unlink/:provider', passportConfig.isAuthenticated, userController.getOauthUnlink);

module.exports = router;

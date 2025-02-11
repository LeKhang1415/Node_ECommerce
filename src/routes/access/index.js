const express = require("express");
const AccessControllers = require("../../controllers/accessControllers");
const handelAsync = require("../../utils/handelAsync");
const { authentication } = require("../../auth/authUtils");

const router = express.Router();

// Shop signUp
router.post("/shop/signup", handelAsync(AccessControllers.signup));

router.post("/shop/login", handelAsync(AccessControllers.login));

// Authentication
router.use(authentication);
//////////////////////////
router.post("/shop/logout", handelAsync(AccessControllers.logout));
router.post(
    "/shop/handleRefreshToken",
    handelAsync(AccessControllers.handleRefreshToken)
);

module.exports = router;

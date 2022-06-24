const express = require("express");
const {
  registerUser,
  loginAuthentication,
  allUsers,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").post(registerUser).get(protect, allUsers); // uses multichaining can add .get(), like that
router.post("/login", loginAuthentication);

module.exports = router;

const express = require("express");
const {
  singleChat,
  fetchChat,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
} = require("../controllers/chatController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.route("/").post(protect, singleChat).get(protect, fetchChat);
router.route("/group").post(protect, createGroupChat);
router.route("/rename").put(protect, renameGroup);
router.route("/add").put(protect, addToGroup);
router.route("/remove").put(protect, removeFromGroup);

module.exports = router;

const express = require("express");
const {
    getAllProfiles,
    getProfileByUsername,
    createProfile,
    getProfileById,
    updateProfile,
    deleteProfile,
} = require("../controllers/ProfileController");
 
const router = express.Router();

router.route("/").get(getAllProfiles).post(createProfile);
router.route("/username/:username").get(getProfileByUsername);
router.route("/:id").get(getProfileById).put(updateProfile).delete(deleteProfile);
 
module.exports = router;
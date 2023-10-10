const ProfileModel = require("../models/Profile");
 
exports.getAllProfiles = async () => {
  return await ProfileModel.find();
};
 
exports.getProfileByUsername = async (username) => {
  return await ProfileModel.find({name:username});
};

exports.createProfile = async (profile) => {
  return await ProfileModel.create(profile);
};
exports.getProfileById = async (id) => {
  return await ProfileModel.findById(id);
};
 
exports.updateProfile = async (id, profile) => {
  return await ProfileModel.findByIdAndUpdate(id, profile);
};
 
exports.deleteProfile = async (id) => {
  return await ProfileModel.findByIdAndDelete(id);
};
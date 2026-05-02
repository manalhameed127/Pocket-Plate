const getProfile = (req, res) => {
  return res.json({
    message: "Protected profile data",
    user: req.user,
  });
};

module.exports = {
  getProfile,
};
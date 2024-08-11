import User from "../models/User.js";

// get all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// get me user
export const getMe = async (req, res) => {
  try {
    // req.user is available because of the protect middleware
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      academicLevel: user.academicLevel,
      academicYear: user.academicYear,
      major: user.major,
      group: user.group,
      profileImage: user.profileImage,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/me/update
// @access  Private
export const updateUserProfile = async (req, res) => {
  const { email, currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify current password if newPassword is provided
    if (newPassword) {
      if (!currentPassword) {
        return res
          .status(400)
          .json({ message: "Current password is required to change password" });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Current password is incorrect" });
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    // Update fields if they are provided
    if (email) user.email = email;

    // Handle profile image update
    if (req.file) {
      user.profileImage = `/uploads/${req.file.filename}`;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

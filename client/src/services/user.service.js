import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/test/";
const USER_URL = "http://localhost:8080/api/user/";

const updateProfileImage = async (userId, file, onUploadProgress) => {
  try {
    const formData = new FormData();
    formData.append("profileImage", file);

    const response = await axios.put(
      `${USER_URL}${userId}/profile-image`,
      formData,
      {
        onUploadProgress,
      }
    );

    if (response.status === 200) {
      console.log("Profile image updated successfully");
    } else {
      console.error("Error updating profile image");
    }
  } catch (error) {
    console.error("An error occurred:", error.message);
  }
};

const getProfileImage = async userId => {
  try {
    const response = await axios.get(`${USER_URL}${userId}/profile-image`, {
      responseType: "blob",
    });

    const imageBlob = response.data;

    return URL.createObjectURL(imageBlob);
  } catch (error) {
    console.error("Error fetching profile image:", error);
  }
};

const updateProfile = (userId, userData) => {
  return axios.put(`http://localhost:8080/api/user/${userId}`, userData);
};

export const getUserById = userId => {
  try {
    const response = axios.get(USER_URL + userId);
    return response;
  } catch (error) {
    console.error("Error fetching profile image:", error);
  }
};

export const getAllUsers = async () => {
  try {
    const response = await axios.get("http://localhost:8080/api/users");
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};

const getPublicContent = () => {
  return axios.get(API_URL + "all");
};

const getUserBoard = () => {
  return axios.get(API_URL + "user", { headers: authHeader() });
};

const getModeratorBoard = () => {
  return axios.get(API_URL + "mod", { headers: authHeader() });
};

const getAdminBoard = () => {
  return axios.get(API_URL + "admin", { headers: authHeader() });
};

export default { // eslint-disable-line
  updateProfileImage,
  updateProfile,
  getProfileImage,
  getUserById,
  getPublicContent,
  getUserBoard,
  getModeratorBoard,
  getAdminBoard,
};

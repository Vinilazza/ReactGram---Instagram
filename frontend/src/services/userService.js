import { api, requestConfig } from "../utils/config";

// Get user details
const profile = async (data, token) => {
  const config = requestConfig("GET", data, token);

  try {
    const res = await fetch(api + "/users/profile", config)
      .then((res) => res.json())
      .catch((err) => err);

    return res;
  } catch (error) {
    console.log(error);
  }
};

// Update user details
const updateProfile = async (data, token) => {
  const config = requestConfig("PUT", data, token, true);

  try {
    const res = await fetch(api + "/users/", config)
      .then((res) => res.json())
      .catch((err) => err);

    return res;
  } catch (error) {
    console.log(error);
  }
};

// Get user details

//get user details
const getUserDetails = async (id) => {
  const config = requestConfig("GET");

  try {
    const res = await fetch(api + "/users/" + id, config)
      .then((res) => res.json())
      .catch((err) => err);

    return res;
  } catch (error) {
    console.log(error);
  }
};
const followUser = async (id, userId, token) => {
  const config = requestConfig("POST", { userId }, token);

  try {
    const res = await fetch(api + "/users/follow/" + id, config);
    return await res.json();
  } catch (error) {
    console.log(error);
  }
};

const unfollowUser = async (id, userId, token) => {
  const config = requestConfig("POST", { userId }, token);

  try {
    const res = await fetch(api + "/users/unfollow/" + id, config);
    return await res.json();
  } catch (error) {
    console.log(error);
  }
};

// Ajuste para obter seguidores e seguidos se necessário
const getFollowers = async (token) => {
  const config = requestConfig("GET", null, token);

  try {
    const res = await fetch(api + "/users/followers/", config);
    return await res.json();
  } catch (error) {
    console.log(error);
  }
};

const getFollowing = async (token) => {
  const config = requestConfig("GET", null, token);

  try {
    const res = await fetch(api + "/users/following/", config);
    return await res.json();
  } catch (error) {
    console.log(error);
  }
};

const userService = {
  profile,
  updateProfile,
  getUserDetails,
  getFollowers,
  getFollowing,
  followUser,
  unfollowUser,
};

export default userService;

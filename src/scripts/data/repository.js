import Idb from "./idb.js";

const BASE_URL = "https://story-api.dicoding.dev/v1";

export const registerUser = async (name, email, password) => {
  try {
    const response = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Registrasi gagal");
    }

    return result;
  } catch (error) {
    console.error("Register error:", error);
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await fetch("https://story-api.dicoding.dev/v1/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Login gagal");
    }
    return result.loginResult.token; // <- token diambil dari hasil response
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const getAllStories = async () => {
  try {
    const response = await fetch(`${BASE_URL}/stories`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    const stories = result.listStory;

    // Perbarui IndexedDB dengan mempertahankan status isFavorite
    for (const story of stories) {
      const existingStory = await Idb.getStory(story.id);
      await Idb.putStory({
        ...story,
        isFavorite: existingStory?.isFavorite || false,
      });
    }

    return stories;
  } catch (error) {
    console.error("Error fetching stories:", error);
    return await Idb.getAllStories();
  }
};

export const postStoryWithLocation = async (formData) => {
  const token = localStorage.getItem("token");

  const response = await fetch("https://story-api.dicoding.dev/v1/stories", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const result = await response.json();
  if (!response.ok) throw new Error(result.message);
  return result;
};

export const getStoryById = async (id) => {
  const token = localStorage.getItem("token");
  console.log("Token:", token ? "Valid" : "Missing");
  if (!token) {
    throw new Error("Token tidak ditemukan. Silakan login.");
  }

  try {
    const response = await fetch(
      `https://story-api.dicoding.dev/v1/stories/${id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();
    if (!response.ok) {
      console.error("API error:", result.message);
      const story = await Idb.getStory(id);
      if (!story) {
        throw new Error("Story tidak ditemukan di IndexedDB.");
      }
      return story;
    }

    const story = result.story;
    const existingStory = await Idb.getStory(id);
    await Idb.putStory({
      ...story,
      isFavorite: existingStory?.isFavorite || false,
    });
    return story;
  } catch (error) {
    console.error("Fetch error:", error);
    const story = await Idb.getStory(id);
    if (!story) {
      throw new Error("Story tidak ditemukan di IndexedDB.");
    }
    return story;
  }
};

export const toggleFavoriteStory = async (id) => {
  try {
    const story = await Idb.getStory(id);
    if (!story) {
      throw new Error("Story tidak ditemukan di IndexedDB");
    }
    const isFavorite = !story.isFavorite;
    await Idb.setFavoriteStory(id, isFavorite);
    return isFavorite;
  } catch (error) {
    console.error("Error toggling favorite:", error);
    throw error;
  }
};

export const getFavoriteStories = async () => {
  try {
    return await Idb.getFavoriteStories();
  } catch (error) {
    console.error("Error fetching favorite stories:", error);
    return [];
  }
};

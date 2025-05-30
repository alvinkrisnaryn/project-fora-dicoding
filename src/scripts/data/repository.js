import {
  saveStories,
  getAllStories as getCachedStories,
  clearOldStories,
} from "../utils/indexedDB.js";

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
    console.log("Data stories:", result.listStory);

    // Simpan ke IndexedDB
    await saveStories(result.listStory);
    // Bersihkan data lama (> 7 hari)
    await clearOldStories(7);

    return result.listStory;
  } catch (error) {
    console.error("Error fetching stories:", error);
    // Fallback ke IndexedDB
    const cachedStories = await getCachedStories();
    if (cachedStories && cachedStories.length > 0) {
      console.log("Using cached stories:", cachedStories);
      return cachedStories;
    }
    throw new Error("No stories available offline");
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
      return null; // Kembalikan null alih-alih melempar error
    }

    return result.story;
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
};

const DB_NAME = "ForaDB";
const DB_VERSION = 1;
const STORE_NAME = "stories";

// Membuka database
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.constains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
        store.createIndex("created_at", "created_at", { unique: false });
      }
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject(`Error opening database: ${event.target.error}`);
    };
  });
}

// Menyimpan array cerita
async function saveStories(stories) {
  console.log("Saving stories:", stories); // Debung log
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    // Hapus data lama sebelum menyimpan yang baru
    const clearRequest = store.clear();
    await new Promise((resolve, reject) => {
      clearRequest.onsuccess = resolve;
      clearRequest.onerror = () => reject("Error clearing object store");
    });

    // simpan setiap cerita
    for (const story of stories) {
      story.put(story);
    }

    await new Promise((resolve, reject) => {
      transaction.oncomplete = resolve;
      transaction.onerror = () => reject("Error saving stories");
    });
  } catch (error) {
    console.error("Error saving stories:", error);
    throw error;
  }
}

// Mengambil semua cerita
async function getAllStories() {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = await store.getAll();

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject("Error fetching stories");
    });
  } catch (error) {
    console.error("Error fetching stories:", error);
    throw error;
  }
}

// Menghapus cerita berdasarkan ID
async function deleteStory(id) {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    store.delete(id);

    await new Promise((resolve, reject) => {
      transaction.oncomplete = resolve;
      transaction.onerror = () => reject("Error deleting story");
    });
  } catch (error) {
    console.error("Error deleting story:", error);
    throw error;
  }
}

// Menghapus cerita yang lebih lama dari maxAgeDays
async function clearOldStories(maxAgeDays = 7) {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const index = store.index("created_at");
    const now = new Date();
    const threshold = new Date(now.setDate(now.getDate() - maxAgeDays));

    const request = index.openCursor();
    request.onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        const createdAt = new Date(cursor.value.created_at);
        if (createdAt < threshold) {
          cursor.delete();
        }
        cursor.continue();
      }
    };

    await new Promise((resolve, reject) => {
      transaction.oncomplete = resolve;
      transaction.onerror = () => reject("Error deleting old stories");
    });
  } catch (error) {
    console.error("Error clearing old stories:", error);
    throw error;
  }
}

export { saveStories, getAllStories, deleteStory, clearOldStories };

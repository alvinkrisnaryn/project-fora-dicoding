import { openDB } from "idb";

const DB_NAME = "fora-database";
const DB_VERSION = 1;
const STORE_NAME = "stories";

const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME, { keyPath: "id" });
    }
  },
});

const Idb = {
  async getAllStories() {
    return (await dbPromise).getAll(STORE_NAME);
  },
  async getStory(id) {
    return (await dbPromise).get(STORE_NAME, id);
  },
  async putStory(story) {
    return (await dbPromise).put(STORE_NAME, story);
  },
  async deleteStory(id) {
    return (await dbPromise).delete(STORE_NAME, id);
  },
};

export default Idb;

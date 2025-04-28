const UrlParser = {
  parseActiveUrl() {
    const urlSplit = this._urlSplitter(
      window.location.hash.slice(1).toLowerCase()
    );
    console.log("URL Split:", urlSplit);
    if (!urlSplit.length) {
      console.warn("No URL resource found, defaulting to home");
      return { resource: null, id: null, verb: null };
    }

    return {
      resource: urlSplit[0] || null,
      id: urlSplit[1] || null,
      verb: urlSplit[2] || null,
    };
  },

  parseActiveUrlWithCombiner() {
    const url = this.parseActiveUrl(); // Gunakan objek yang sudah diparsing
    const combined = this._urlCombiner(url);
    console.log("Combined URL:", combined);
    return combined;
  },

  _urlSplitter(url) {
    // Tambahkan / di awal jika tidak ada
    const normalizedUrl = url.startsWith("/") ? url : `/${url}`;
    return normalizedUrl.split("/").filter(Boolean); // Hilangkan elemen kosong
  },

  _urlCombiner({ resource, id, verb }) {
    return (
      (resource ? `/${resource}` : "/") +
      (id ? "/:id" : "") +
      (verb ? `/${verb}` : "")
    );
  },
};

export default UrlParser;

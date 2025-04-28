const UrlParser = {
  parseActiveUrl() {
    const urlSplit = this._urlSplitter(
      window.location.hash.slice(1).toLowerCase()
    );
    if (!urlSplit.length) {
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

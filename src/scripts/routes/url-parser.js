const UrlParser = {
  parseActiveUrl() {
    const urlSplit = this._urlSplitter(
      window.location.hash.slice(1).toLowerCase()
    );
    return {
      resource: urlSplit[1] || null,
      id: urlSplit[2] || null,
      verb: urlSplit[3] || null,
    };
  },

  parseActiveUrlWithCombiner() {
    const url = this._urlSplitter(window.location.hash.slice(1).toLowerCase());
    return this._urlCombiner(url);
  },

  _urlSplitter(url) {
    return url.split("/");
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

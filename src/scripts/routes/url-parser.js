const UrlParser = {
  parseActiveUrlWithCombiner() {
    const url = window.location.hash.slice(1).toLowerCase() || '/';
    const splittedUrl = this._urlSplitter(url);
    return this._urlCombiner(splittedUrl);
  },

  _urlSplitter(url) {
    const urls = url.split('/');
    return {
      resource: urls[1] || null,
      id: urls[2] || null,
      verb: urls[3] || null,
    };
  },

  _urlCombiner(url) {
    return (url.resource ? `/${url.resource}` : '/') +
           (url.id ? '/:id' : '') +
           (url.verb ? `/${url.verb}` : '');
  },
};

export default UrlParser;

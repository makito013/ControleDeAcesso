window.urlParams = string => {
  if (!string && !window.location.search) {
    return false;
  }
  string = string || window.location.search;
  if (string[0] === "?") {
    string = string.slice(1);
  }
  return string
    .split("&")
    .map(p => p.split("="))
    .reduce((obj, pair) => {
      const [key, value] = pair.map(decodeURIComponent);
      return { ...obj, [key]: value };
    }, {});
};

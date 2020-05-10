const postMessage = (id = "", data = "") => {
  const message = { id: id, data: data };
  window.postMessage(JSON.stringify(message), "*");
};

export default postMessage;

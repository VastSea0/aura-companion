let listenersMap = {};

export const addListener = (eventName, listener) => {
  listenersMap[eventName] = listener;
};

export const removeListener = (eventName) => {
  delete listenersMap[eventName];
};

export const removeAllListeners = () => {
  listenersMap = {};
};

export const notify = (eventName, ...params) => {
  const listener = listenersMap[eventName];
  if (!listener) return false;
  listener(...params);
  return true;
};

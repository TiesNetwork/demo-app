const deepClear = (
  data: Array<Object> | Object,
  keys: Array<string> | string,
) => {
  const formattedKeys = [].concat(keys);

  if (Array.isArray(data)) {
    return data.map(item => deepClear(item, keys));
  }

  if (data !== null && typeof data === 'object') {
    const newObject = {};

    for (const property in data) {
      if (formattedKeys.indexOf(property) === -1) {
        newObject[property] = deepClear(data[property], keys);
      }
    }

    return newObject;
  }

  return data;
};

export default deepClear;

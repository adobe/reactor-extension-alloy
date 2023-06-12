module.exports = () => {
  const map = {};
  return {
    setPairs: (keys, pairs) => {
      keys.forEach(key => {
        map[key] = [];
      });
      pairs.forEach(([key, value]) => {
        if (keys.includes(key)) {
          map[key].push(value);
        }
      });
    },
    getKeys: keys => {
      const valueArrays = keys.map(key => map[key]).filter(values => values);
      return [].concat(...valueArrays);
    },
    getAll: () => {
      const valueArrays = Object.values(map);
      return [].concat(...valueArrays);
    }
  };
};

const createRefObj = (list, key, value) => {
  // this function is designed to be passed a list of objects
  // it creates a single reference object full of key-value pairs
  // one pair for each element in the list
  // the key will be the second property passed in
  // the value will be the third property passed in
  return list.reduce((acc, curr) => {
    acc[curr[key]] = curr[value];
    return acc;
  }, {});
};

module.exports = { createRefObj };

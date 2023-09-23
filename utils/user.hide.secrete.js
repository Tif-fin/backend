
exports.removeAttribute = (users = [], keys = []) => {
    // Check if the users array is empty
    if (users.length === 0) {
      return users;
    }
    // Check if the keys array is empty
    if (keys.length === 0) {
      return users;
    }
    // Iterate over the users array
    users.forEach((user) => {
      // Iterate over the keys array
      keys.forEach((key) => {
        // Delete the key from the user object
        user[key] = undefined
      });
    });
    // Return the updated users array
    return users;
  };
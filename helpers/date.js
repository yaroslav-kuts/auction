const getAge = function (birthday) {
  const ageDate = new Date(Date.now() - birthday.getTime());
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

module.exports = { getAge };

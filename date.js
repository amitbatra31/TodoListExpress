exports.getDate = function () {
  var currentDate = new Date();
  var options = {
    weekday: "long",
    month: "long",
    year: "numeric",
    day: "numeric",
  };
  const Day = currentDate.toLocaleDateString("en-US", options);
  return Day;
};

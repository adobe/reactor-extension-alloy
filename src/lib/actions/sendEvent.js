"use strict";

var getInstance = require("./getInstance.js");

module.exports = function(settings) {
  var instance = getInstance("alloy");
  instance("event", {
    data: {
      "products": ["shirt", "shoes"],
      "total": [19.99]
    }
  });
};

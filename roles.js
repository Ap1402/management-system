const AccessControl = require("accesscontrol");
const ac = new AccessControl();

exports.roles = (function() {
  ac.grant("patient")
    .readOwn("patient")
    .updateOwn("patient")
    .createOwn("appointment")
    .readOwn("appointment")
    .updateOwn("appointment")
    .deleteOwn("appointment");

  ac.grant("doctor")
    .readAny("patient")
    .createAny("patient")
    .updateAny("patient")
    .deleteAny("patient")
    .readOwn("doctor")
    .updateOwn("doctor")
    .deleteOwn("appointment")
    .createOwn("appointment")
    .updateOwn("appointment")
    .readOwn("appointment");

  ac.grant("admin")
    .extend("patient")
    .extend("doctor")
    .createAny("patient")
    .createAny("doctor")
    .createAny("appointment")
    .readAny("appointment")
    .readAny("doctor")
    .readAny("patient")
    .updateAny("appointment")
    .updateAny("doctor")
    .updateAny("patient")
    .deleteAny("patient")
    .deleteAny("doctor")
    .deleteAny("appointment");

  return ac;
})();
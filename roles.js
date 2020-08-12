const AccessControl = require("accesscontrol");
const ac = new AccessControl();

exports.roles = (function () {
  ac.grant("patient")
    .readOwn("patient")
    .updateOwn("patient")
    .createOwn("patient")
    .createOwn("appointment")
    .readOwn("appointment")
    .updateOwn("appointment")
    .deleteOwn("appointment")
    .readAny("doctor")
    .readAny("department");

  ac.grant("doctor")
    .readAny("patient")
    .createAny("patient")
    .updateAny("patient")
    .deleteAny("patient")
    .readOwn("doctor")
    .readAny("doctor")
    .updateOwn("doctor")
    .deleteOwn("appointment")
    .createOwn("appointment")
    .updateOwn("appointment")
    .readOwn("appointment");

  ac.grant("admin")
    .extend("patient")
    .extend("doctor")
    .createAny("doctor")
    .createAny("appointment")
    .readAny("appointment")
    .readAny("doctor")
    .updateAny("appointment")
    .updateAny("doctor")
    .deleteAny("patient")
    .deleteAny("doctor")
    .deleteAny("appointment")
    .deleteAny("department")
    .createAny("department")
    .updateAny("department")
    .updateAny("user");

  return ac;
})();

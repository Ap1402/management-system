const request = require("supertest");
const app = require("../app");
const { userOne, setupDatabase, doctorOneID } = require("./fixtures/db");

beforeAll(setupDatabase);

test("Should create a appointment", async () => {
  await request(app)
    .post("/api/appointments")
    .set("x-auth-token", `${userOne.tokens[0].token}`)
    .send({
      selectedDate: "2010-10-02",
      description: "Test Description",
      doctor: doctorOneID
    })
    .expect(200);
});

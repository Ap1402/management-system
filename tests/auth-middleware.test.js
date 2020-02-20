const auth = require("../middleware/auth");
const request = require("supertest");
const app = require("../app");
const { userOne, userOneId, setupDatabase } = require("./fixtures/db");

beforeEach(setupDatabase);

test("Should login existing user ", async () => {
  await request(app)
    .post("/api/auth")
    .send({
      email: userOne.email,
      password: userOne.password
    })
    .expect(200);
});

test("Should not login existing user with wrong password", async () => {
  await request(app)
    .post("/api/auth")
    .send({
      email: userOne.email,
      password: "12244"
    })
    .expect(400);
});

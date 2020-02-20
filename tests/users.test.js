const auth = require("../middleware/auth");
const request = require("supertest");
const app = require("../app");
const { userOne, userOneId, setupDatabase } = require("./fixtures/db");

beforeEach(setupDatabase);

test("Should get  all existing users", async () => {
  await request(app)
    .get("/api/users")
    .set("x-auth-token", `${userOne.tokens[0].token}`)
    .send()
    .expect(201);
});

test("Should submit a NEW patient information", async () => {
  await request(app)
    .post("/api/patients")
    .set("x-auth-token", `${userOne.tokens[0].token}`)
    .send({
      address: "San diego",
      dni: "111111111",
      history: "Fake history"
    })
    .expect(200);
});

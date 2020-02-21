const request = require("supertest");
const app = require("../app");
const {
  userOne,
  setupDatabase,
  doctorOneID,
  userTwoID
} = require("./fixtures/db");

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
    .expect(201);
});

test("Should get all appointment", async () => {
  const allAppointments = await request(app)
    .get("/api/appointments")
    .set("x-auth-token", `${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  console.log("Get all appointments log ---", allAppointments.body);
});

test("Should get all current user appointments ", async () => {
  const allAppointments = await request(app)
    .get("/api/appointments/me")
    .set("x-auth-token", `${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  console.log("Get all actual user appointments log ---", allAppointments.body);
});

test("Should get all appointments by userID", async () => {
  const allAppointments = await request(app)
    .get("/api/appointments/user/" + userOne._id)
    .set("x-auth-token", `${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  console.log("Get all appointments by userID log ---", allAppointments.body);
});

test("Should throw a error, userID does not exists", async () => {
  const allAppointments = await request(app)
    .get("/api/appointments/user/" + "1232411231312")
    .set("x-auth-token", `${userOne.tokens[0].token}`)
    .send()
    .expect(404);
});

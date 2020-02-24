const request = require("supertest");
const app = require("../app");
const {
  userOne,
  setupDatabase,
  userTwoID,
  userAdminID,
  userAdmin
} = require("./fixtures/db");

beforeAll(setupDatabase);

test("Should create a doctor", async () => {
  const requestLog = await request(app)
    .post("/api/doctors")
    .set("x-auth-token", `${userAdmin.tokens[0].token}`)
    .send({
      schedule: [
        { day: "Monday", start: "08:00", end: "10:00" },
        { day: "Wednesday", start: "08:00", end: "10:00" },
        { day: "Friday", start: "08:00", end: "10:00" }
      ],
      unavaliableDates: ["2020-02-25", "2020-02-29"],
      field: "dermatology",
      userID: userTwoID._id
    })
    .expect(201);
  console.log(requestLog);
});

/* test("Should get all appointment", async () => {
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
}); */

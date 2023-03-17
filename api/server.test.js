// testleri buraya yazın

const request = require("supertest");
const server = require("./server");
const db = require("../data/dbConfig");

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});

afterAll(async () => {
  await db.destroy();
});

test("[0] Testler çalışıyor", () => {
  expect(true).not.toBe(false);
});

describe("[POST] api/auth/register", () => {
  it("[1] yeni kullanıcı adı istenildiği gibi dönüyor", async () => {
    await request(server).post("/api/auth/register").send({
      username: "JohnReese",
      password: "123456",
    });
    const newUser = await db("users").where("username", "JohnReese").first();
    expect(newUser.username).toBe("JohnReese");
  }, 1000);

  it("[2] username veya password olmadığında hata veriyor", async () => {
    const res = await request(server)
      .post("/api/auth/register")
      .send({ username: "Shaw" });
    expect(res.body.message).toMatch(/şifre gereklidir/i);
  }, 1000);

  it("[3] username önceden alındıysa hata dönüyor", async () => {
    const res = await request(server)
      .post("/api/auth/register")
      .send({ username: "JohnReese", password: "123456" });
    expect(res.status).toBe(422);
    expect(res.body.message).toBe("username kullanılmakta");
  }, 1000);

  it("[4] username password boş yok", async() => {
    const d = [
      {"username": "", "password": 1234},
      {"password": 1234},
      {"username": "apaci", "password": ""},
      {"username": "apaci"}
    ];
    const res1= await superTest(server).post("/api/auth/login").send(d[0]);
    expect(res1.status).toBe(400);
    expect(res1.body.message).toBe("username veya password eksik");
    const res2= await superTest(server).post("/api/auth/login").send(d[1]);
    expect(res2.status).toBe(400);
    expect(res2.body.message).toBe("username veya password eksik");
    const res3= await superTest(server).post("/api/auth/login").send(d[2]);
    expect(res3.status).toBe(400);
    expect(res3.body.message).toBe("username veya password eksik");
    const res4= await superTest(server).post("/api/auth/login").send(d[3]);
    expect(res4.status).toBe(400);
    expect(res4.body.message).toBe("username veya password eksik");   
  },1000);
});

describe("[POST] api/auth/login", () => {
  it("[5] login oluyor mu?", async () => {
    const response = await request(server)
      .post("/api/auth/login")
      .send({ username: "JohnReese", password: "123456" });
    expect(response.status).toBe(200);
  }, 1000);

  it("[6] hatalı bilgilerle login olmuyor", async () => {
    const response = await request(server)
      .post("/api/auth/login")
      .send({ username: "Harold", password: "123456" });
    expect(response.status).toBe(401);
  }, 1000);
});
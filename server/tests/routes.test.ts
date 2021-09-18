import "ts-mocha";
import chai from "chai";
import { it } from "mocha";
import axios, { AxiosRequestConfig } from "axios";
import { TAKU } from "..";

const localhost = "http://localhost:8081";

const userLoginBody = {
  username: makeid(),
  password: "fuckingpassword56",
};

const userSignupBody = {
  ...userLoginBody,
  email: `${makeid()}@gmail.com`,
  repeatPassword: userLoginBody.password,
};

function makeid(length: number = 24) {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < length; i++) {
    result += characters.charAt(~~(Math.random() * characters.length));
  }
  return result;
}

new TAKU(8263);

describe("POST /signup", () => {
  const options = (body: object): AxiosRequestConfig => ({
    url: `${localhost}/signup`,
    method: "post",
    data: body,
    headers: { "Content-Type": "application/json" },
  });

  it("Can signup a new user", async () => {
    const { data } = await axios(options(userSignupBody));
    chai.expect(data.code).to.be.equal("user.created");
  });

  it("Knows when the passwords are mismatched", async () => {
    const body = {
      username: makeid(),
      email: `${makeid()}@gmail.com`,
      password: "testing212",
      repeatPassword: "testing2341",
    };
    await axios(options(body)).catch((error) => {
      chai.expect(error.response.data.code).to.be.equal("password.mismatch");
    });
  });

  it("Knows when the password is missing", async () => {
    const body = {
      username: makeid(),
      email: `${makeid()}@gmail.com`,
      repeatPassword: "testing2341",
    };
    await axios(options(body)).catch((error) => {
      chai.expect(error.response.data.code).to.be.equal("password.required");
    });
  });

  it("Knows when the repeatPassword is missing", async () => {
    const body = {
      username: makeid(),
      email: `${makeid()}@gmail.com`,
      password: "testing2341",
    };
    await axios(options(body)).catch((error) => {
      chai.expect(error.response.data.code).to.be.equal("repeatPassword.required");
    });
  });

  it("Knows when the email is missing", async () => {
    const body = {
      username: makeid(),
      repeatPassword: "testing2341",
      password: "testing2341",
    };
    await axios(options(body)).catch((error) => {
      chai.expect(error.response.data.code).to.be.equal("email.required");
    });
  });

  it("Knows when the username is missing", async () => {
    const body = {
      email: `${makeid()}@gmail.com`,
      repeatPassword: "testing2341",
      password: "testing2341",
    };
    await axios(options(body)).catch((error) => {
      chai.expect(error.response.data.code).to.be.equal("username.required");
    });
  });
});

describe("POST /login", () => {
  it("Can login to that new", async () => {
    const { data } = await axios({
      url: `${localhost}/login`,
      method: "post",
      data: userLoginBody,
      headers: { "Content-Type": "application/json" },
    });
    chai.expect(data.code).to.be.equal("login.successful");
  });
});

// process.exit(0)

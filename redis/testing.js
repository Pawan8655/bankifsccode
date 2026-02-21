const client = require("./client");

(async () => {
  try {
    await client.connect();

    await client.set("key", "value");
    const value = await client.get("key");
    console.log(value);

    await client.hSet("user-session:123", {
      name: "John",
      surname: "Smith",
      company: "Redis",
      age: 29,
    });

    const userSession = await client.hGetAll("user-session:123");
    console.log(JSON.stringify(userSession, null, 2));

    await client.quit();
  } catch (err) {
    console.error(err);
  }
})();

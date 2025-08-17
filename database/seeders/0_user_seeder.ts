import User from "#models/user";
import { BaseSeeder } from "@adonisjs/lucid/seeders";

export default class extends BaseSeeder {
  async run() {
    await User.create({
      id: 1,
      username: "tamim",
      password: "1234",
    });
  }
}

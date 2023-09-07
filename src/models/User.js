import { UserMapper } from "../repository/Mapper/mapper.js";
import { isPassword } from "../utils/regex/isPassword.js";
export class User {
  #user;
  constructor(userSchema, dto) {
    this.#user = UserMapper.mapToSchema(userSchema, dto);
    this.isValidPasswordBeforeHash(dto.password);
  }

  static async findUserById(userId, database) {
    const userRecord = await database.getRecordById(userId, "users");
    return userRecord;
  }

  static async findUserByEmail(email, database) {
    const userRecord = await database.getRecordsByQuery({ email }, "users");
    return userRecord[0];
  }

  static async findUserByPhone(phone, database) {
    const userRecord = await database.getRecordsByQuery({ phone }, "users");
    return userRecord[0];
  }

  async insertUserToDatabase() {
    try {
      await this.#user.save();
      console.log("User created");
      this._id = this.#user._id;
      this.name = this.#user.name;
      this.email = this.#user.email;
      this.password = this.#user.password;
      this.role = this.#user.role;
      this.phone = this.#user.phone;
    } catch (error) {
      throw error;
    }
  }

  isValidPasswordBeforeHash(password) {
    if (!isPassword(password)) {
      throw new Error(
        "Password is invalid should contain a special character & cannot less than 6 characters & cannot over 16 characters"
      );
    }
  }
}

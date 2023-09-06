import { UserMapper } from "../repository/Mapper/mapper.js";
import { isPassword } from "../utils/regex/isPassword.js";
export class User {
  #userModel;
  constructor(userSchema, dto) {
    this.#userModel = UserMapper.mapToSchema(userSchema, dto);
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
      await this.#userModel.save();
      console.log("User created");
      this._id = this.#userModel._id;
      this.name = this.#userModel.name;
      this.email = this.#userModel.email;
      this.password = this.#userModel.password;
      this.role = this.#userModel.role;
      this.phone = this.#userModel.phone;
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

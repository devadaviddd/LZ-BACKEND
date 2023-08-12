import { UserMapper } from "../repository/Mapper/mapper.js";
import { database } from "../di/index.js";
import { isPassword } from "../utils/regex/isPassword.js";
export class User {
  #userModel;
  constructor(userSchema, dto) {
    this.#userModel = UserMapper.mapToSchema(userSchema, dto);
    this.isValidPasswordBeforeHash(dto.password);
  }

  async insertUserToDatabase() {
    try {
      await this.#userModel.save();
      console.log("User created");
      this._id = this.#userModel._id;
      this.name = this.#userModel.name;
      this.email = this.#userModel.email;
      this.password = this.#userModel.password;
      this.avatar = this.#userModel.avatar;
      this.role = this.#userModel.role;
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

  static async findUserById(userId) {
    const userRecord = await database.findExistedRecord(userId, "users");
    console.log("userRecord", userRecord);
    return userRecord;
  }
}

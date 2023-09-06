import { CustomerMapper } from "../repository/Mapper/mapper.js";

export class Customer {
  #customerModel;
  constructor(customerModel, dto) {
    this.#customerModel = CustomerMapper.mapToSchema(customerModel, dto);
  }

  async insertCustomerToDatabase(customerId) {
    try {
      if (customerId) {
        this.#customerModel._id = new ObjectId(customerId);
      }
      await this.#customerModel.save();
      console.log("Customer created");
      this._id = this.#customerModel._id;
      this.name = this.#customerModel.name;
      this.email = this.#customerModel.email;
      this.password = this.#customerModel.password;
      this.phone = this.#customerModel.phone;
      this.address = this.#customerModel.address;
    } catch (error) {
      throw error;
    }
  }

  static async getProfile(customerId, database) {
    const customerRecord = await database.getRecordById(
      customerId,
      "customers"
    );
    return {
      _id: customerRecord._id,
      name: customerRecord.name,
      email: customerRecord.email,
      phone: customerRecord.phone,
      address: customerRecord.address,
    };
  }
}

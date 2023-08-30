import { CustomerMapper } from "../repository/Mapper/mapper";

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
      this.avatar = this.#customerModel.avatar;
      this.phone = this.#customerModel.phone;
      this.address = this.#customerModel.address;
    } catch (error) {
      throw error;
    }
  }
}




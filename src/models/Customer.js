import { CustomerMapper } from "../repository/Mapper/mapper.js";

export class Customer {
  #customer;
  constructor(customerSchema, dto) {
    this.#customer = CustomerMapper.mapToSchema(customerSchema, dto);
    this._id = this.#customer._id;
    this.name = this.#customer.name;
    this.email = this.#customer.email;
    this.password = this.#customer.password;
    this.phone = this.#customer.phone;
    this.address = this.#customer.address;
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
  static async updateCustomer(customerId, updatedFields, database) {
    await database.updateRecordById(customerId, updatedFields, "customers");
    const updatedCustomer = await database.getRecordById(
      customerId,
      "customers"
    );
    console.log("updatedCustomer", updatedCustomer);
    return updatedCustomer;
  }
}

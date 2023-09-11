import mongoose from "mongoose";

export class AdminMapper {
  static mapToSchema(schema, dto) {
    mongoose.model("Admin", schema);
    const AdminModel = mongoose.model("Admin");
    const admin = new AdminModel({
      id: dto._id,
      name: dto.name,
      email: dto.email,
      password: dto.password,
      categories: dto.categories,
      phone: dto.phone,
    });

    return admin;
  }
}

export class SellerMapper {
  static mapToSchema(schema, dto) {
    mongoose.model("Seller", schema);
    const SellerModel = mongoose.model("Seller");
    const seller = new SellerModel({
      id: dto._id,
      name: dto.name,
      email: dto.email,
      password: dto.password,
      status: dto.status,
      order: dto.order,
      businessName: dto.businessName,
      phone: dto.phone,
    });
    return seller;
  }
}

export class CustomerMapper {
  static mapToSchema(schema, dto) {
    mongoose.model("Customer", schema);
    const CustomerModel = mongoose.model("Customer");
    const customer = new CustomerModel({
      id: dto._id,
      name: dto.name,
      email: dto.email,
      password: dto.password,
      phone: dto.phone,
      address: dto.address,
    });
    return customer;
  }
}

export class ProductMapper {
  static mapToSchema(schema, dto) {
    mongoose.model("Product", schema);
    const ProductModel = mongoose.model("Product");
    const product = new ProductModel({
      id: dto._id,
      title: dto.title,
      price: dto.price,
      description: dto.description,
      categories: dto.categories,
      image: dto.image,
      seller: dto.seller,
      date: dto.date,
      stock: dto.stock,
      image: dto.image,
    });

    return product;
  }
}

export class ProductOrderMapper {
  static mapToSchema(schema, dto) {
    mongoose.model("ProductOrder", schema);
    const ProductOrderModel = mongoose.model("ProductOrder");
    const productOrder = new ProductOrderModel({
      id: dto._id,
      product: dto.product,
      quantity: dto.quantity,
      price: dto.price,
      status: dto.status,
      order: dto.order,
    });
    return productOrder;
  }
}

export class CategoryMapper {
  static mapToSchema(schema, dto) {
    mongoose.model("Category", schema);
    const CategoryModel = mongoose.model("Category");
    const category = new CategoryModel({
      id: dto._id,
      name: dto.name,
      parentId: dto.parentId,
      admins: dto.admins,
      subCategories: dto.subCategories,
    });
    return category;
  }
}

export class UserMapper {
  static mapToSchema(schema, dto) {
    mongoose.model("User", schema);
    const UserModel = mongoose.model("User");
    const user = new UserModel({
      id: dto._id,
      name: dto.name,
      email: dto.email,
      password: dto.password,
      role: dto.role,
      phone: dto.phone,
    });
    return user;
  }
}

export class OrderMapper {
  static mapToSchema(schema, dto) {
    mongoose.model("Order", schema);
    const OrderModel = mongoose.model("Order");
    const order = new OrderModel({
      id: dto._id,
      customer: dto.customer,
      productOrders: dto.productOrder,
    });
    return order;
  }
}

export class CartMapper {
  static mapToSchema(schema, dto) {
    mongoose.model("Cart", schema);
    const CartModel = mongoose.model("Cart");
    const cart = new CartModel({
      cart: dto,
    });
    return cart;
  }
}

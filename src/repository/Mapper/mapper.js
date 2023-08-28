import mongoose from "mongoose";

export class AdminMapper {
  static mapToSchema(schema, dto) {
    mongoose.model("Admin", schema);
    const AdminModel = mongoose.model("Admin");
    const admin = new AdminModel({
      name: dto.name,
      email: dto.email,
      password: dto.password,
      avatar: dto.avatar,
      categories: dto.categories,
    });

    return admin;
  }
}

export class SellerMapper {
  static mapToSchema(schema, dto) {
    mongoose.model("Seller", schema);
    const SellerModel = mongoose.model("Seller");
    const seller = new SellerModel({
      name: dto.name,
      email: dto.email,
      password: dto.password,
      avatar: dto.avatar,
      status: dto.status,
      product: dto.product,
      order: dto.order
    });

    return seller;
  }
}

export class ProductMapper {
  static mapToSchema(schema, dto) {
    mongoose.model("Product", schema);
    const ProductModel = mongoose.model("Product");
    const product = new ProductModel({
      title: dto.title,
      price: dto.price,
      description: dto.description,
      categories: dto.categories,
      avatar: dto.avatar
    });

    return product;
  }
}

export class CategoryMapper {
  static mapToSchema(schema, dto) {
    mongoose.model("Category", schema);
    const CategoryModel = mongoose.model("Category");
    const category = new CategoryModel({
      name: dto.name,
      parentId: dto.parentId,
      admins: dto.admins,
      subCategories: dto.subCategories,
    });
    return category;
  }
}

export class ProductMapper {
  static mapToSchema(schema, dto) {
    mongoose.model("Product", schema);
    const ProductModel = mongoose.model("Product");
    const product = new ProductModel({
      title: dto.title,
      price: dto.price,
      description: dto.description,
      categories: dto.categories,
      avatar: dto.avatar
    });

    return product;
  }
}

export class UserMapper {
  static mapToSchema(schema, dto) {
    mongoose.model("User", schema);
    const UserModel = mongoose.model("User");
    const user = new UserModel({
      name: dto.name,
      email: dto.email,
      password: dto.password,
      avatar: dto.avatar,
      role: dto.role,
    });
    return user;
  }
}

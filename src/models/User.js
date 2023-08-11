export class User {
  name;
  email;
  password;
  constructor(dto) {
    const { name, email, password } = dto;
    this.name = name;
    this.email = email;
    this.password = password;
  }
}

export class User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  dob: string;
  gender: string;
  created: string;

  constructor(
    id = 0,
    email = "",
    first_name = "",
    last_name = "",
    dob = "",
    gender = "",
    created = ""
  ) {
    this.id = id;
    this.email = email;
    this.first_name = first_name;
    this.last_name = last_name;
    this.dob = dob;
    this.gender = gender;
    this.created = created;
  }
}

import { EntitySchema } from 'typeorm';

export default new EntitySchema({
  name: "User",
  tableName: "users",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    type: {
      type: "enum",
      enum: ["STARTUP", "PARTNER", "VISITOR"],
      nullable: false,
    },
    registration_code: {
      type: "varchar",
      nullable: true,
      default: "",
    },
    full_name: {
      type: "varchar",
      nullable: false,
    },
    email: {
      type: "varchar",
      nullable: false,
      unique: true,
    },
    phone: {
      type: "varchar",
      nullable: false,
    },
    cpf: {
      type: "varchar",
      nullable: false,
      unique: true,
    },
    birth_date: {
      type: "date",
      nullable: false,
    },
    gender: {
      type: "enum",
      enum: ["MALE", "FEMALE", "NOT_INFORMED"],
      nullable: false,
    },
    how_did_you_know: {
      type: "varchar",
      nullable: false,
    },
    newsletter: {
      type: "boolean",
      nullable: false,
      default: false,
    },
    token: {
      type: "text",
      nullable: true,
    },
    login_code: {
      type: "varchar",
      length: 6,
      nullable: true,
    },
    login_code_expires_at: {
      type: "timestamp",
      nullable: true,
    },
    created_at: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
    },
    updated_at: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
      onUpdate: "CURRENT_TIMESTAMP",
    },
  },
});

import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class UsersTable1747085516834 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: "users",
      columns: [
        { name: "id", type: "uuid", isPrimary: true, generationStrategy: "uuid" },
        { name: "name", type: "varchar", isNullable: false },
        { name: "email", type: "varchar", isNullable: false, isUnique: true },
        { name: "encrypted_password", type: "varchar(255)", isNullable: true },
        { name: "salt_password", type: "varchar(255)", isNullable: true },
        { name: "created_at", type: "timestamp", default: "now()", isNullable: true },
        { name: "updated_at", type: "timestamp", default: "now()", isNullable: true },
      ],
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("users");
  }

}

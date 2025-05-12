import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableOptions } from "typeorm";

export class Icd10codesTable1747016744785 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    const tableProps: TableOptions = {
      name: "icd10codes",
      columns: [
        { name: "id", type: "uuid", isPrimary: true, isNullable: false },
        { name: "code", type: "varchar", isNullable: false },
        { name: "created_at", type: "timestamp", default: "CURRENT_TIMESTAMP", isNullable: true },
        { name: "updated_at", type: "timestamp", default: "CURRENT_TIMESTAMP", isNullable: true },
      ],
    };

    await queryRunner.createTable(new Table(tableProps), true);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("icd10codes");
  }
}

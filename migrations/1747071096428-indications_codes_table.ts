import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableOptions } from "typeorm";

export class IndicationsCodesTable1747071096428 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    const tableProps: TableOptions = {
      name: "indications_codes",
      columns: [
        { name: "indication_id", type: "uuid", isPrimary: true, isNullable: false },
        { name: "icd10code_id", type: "uuid", isPrimary: true, isNullable: false },
        { name: "created_at", type: "timestamp", default: "CURRENT_TIMESTAMP", isNullable: true },
      ],
    };

    await queryRunner.createTable(new Table(tableProps), true);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("indications_codes");
  }
}

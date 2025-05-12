import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableOptions } from "typeorm";

export class IndicationsTable1747016727220 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    const tableProps: TableOptions = {
      name: "indications",
      columns: [
        { name: "id", type: "uuid", isPrimary: true, isNullable: false },
        { name: "name", type: "varchar", isNullable: false },
        { name: "drug_id", type: "uuid", isNullable: false },
        { name: "created_at", type: "timestamp", default: "CURRENT_TIMESTAMP", isNullable: true },
        { name: "updated_at", type: "timestamp", default: "CURRENT_TIMESTAMP", isNullable: true },
      ],
    };

    await queryRunner.createTable(new Table(tableProps), true);

    await queryRunner.createForeignKey("indications",
      new TableForeignKey({
        name: "FK_drugs",
        columnNames: ["drug_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "drugs",
        onDelete: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("indications");
  }
}

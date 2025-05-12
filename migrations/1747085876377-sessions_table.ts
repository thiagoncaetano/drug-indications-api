import { MigrationInterface, QueryRunner, Table, TableOptions } from "typeorm";

export class SessionsTable1747085876377 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tableProps: TableOptions = {
      name: "sessions",
      columns: [
        { name: "id", type: "varchar", isPrimary: true, isNullable: false, generationStrategy: 'uuid' },
        { name: "user_id", type: "varchar(36)", isNullable: false },
        { name: "exp_at", type: "timestamp", isNullable: false, },
        { name: "created_at", type: "timestamp", default: "CURRENT_TIMESTAMP", isNullable: true, }
      ]
    };
    await queryRunner.createTable(new Table(tableProps), true);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("sessions");
  }
}

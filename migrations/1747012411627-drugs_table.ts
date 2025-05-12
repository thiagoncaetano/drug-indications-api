import { MigrationInterface, QueryRunner, Table, TableOptions } from "typeorm";

export class DrugsTable1747012411627 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const tableProps: TableOptions = {
            name: "indications",
            columns: [
                { name: "id", type: "uuid", isPrimary: true, isNullable: false, generationStrategy: 'uuid' },
                { name: "name", type: "varchar", isNullable: false },
                { name: "drug_id", type: "uuid", isNullable: false },
                { name: "created_at", type: "timestamp", default: "CURRENT_TIMESTAMP", isNullable: true },
                { name: "updated_at", type: "timestamp", default: "CURRENT_TIMESTAMP", isNullable: true },
            ]
        };

        await queryRunner.createTable(new Table(tableProps), true);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("indications");
    }
}

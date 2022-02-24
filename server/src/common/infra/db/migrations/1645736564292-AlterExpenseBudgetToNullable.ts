import {MigrationInterface, QueryRunner} from "typeorm";

export class AlterExpenseBudgetToNullable1645736564292 implements MigrationInterface {
    name = 'AlterExpenseBudgetToNullable1645736564292'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."expenses" ALTER COLUMN "budget" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."expenses" ALTER COLUMN "budget" SET NOT NULL`);
    }

}

import {MigrationInterface, QueryRunner} from "typeorm";

export class AlterExpenseAttributes1645736844515 implements MigrationInterface {
    name = 'AlterExpenseAttributes1645736844515'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."expenses" DROP COLUMN "amount"`);
        await queryRunner.query(`ALTER TABLE "public"."expenses" ADD "lineItemCode" numeric`);
        await queryRunner.query(`ALTER TABLE "public"."expenses" ADD "budget" numeric`);
        await queryRunner.query(`ALTER TABLE "public"."expenses" ADD "amountSpent" numeric`);
        await queryRunner.query(`ALTER TABLE "public"."expenses" ADD "date" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."expenses" DROP COLUMN "date"`);
        await queryRunner.query(`ALTER TABLE "public"."expenses" DROP COLUMN "amountSpent"`);
        await queryRunner.query(`ALTER TABLE "public"."expenses" DROP COLUMN "budget"`);
        await queryRunner.query(`ALTER TABLE "public"."expenses" DROP COLUMN "lineItemCode"`);
        await queryRunner.query(`ALTER TABLE "public"."expenses" ADD "amount" numeric NOT NULL`);
    }

}

import {MigrationInterface, QueryRunner} from "typeorm";

export class AddNotesToGrants1647286267693 implements MigrationInterface {
    name = 'AddNotesToGrants1647286267693'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."grants" ADD "notes" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."grants" DROP COLUMN "notes"`);
    }

}

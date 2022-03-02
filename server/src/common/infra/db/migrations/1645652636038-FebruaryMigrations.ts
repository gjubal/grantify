import {MigrationInterface, QueryRunner} from "typeorm";

export class FebruaryMigrations1645652636038 implements MigrationInterface {
    name = 'FebruaryMigrations1645652636038'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "expenses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "lineItemCode" numeric, "budget" numeric NOT NULL, "amountSpent" numeric, "date" character varying NOT NULL, "grantId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_94c3ceb17e3140abc9282c20610" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "attachments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "link" character varying NOT NULL, "grantId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_5e1f050bcff31e3084a1d662412" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "permission_types" ("id" SERIAL NOT NULL, "displayName" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_293d80758aca54060aa603f5f5c" UNIQUE ("displayName"), CONSTRAINT "PK_215b1e2fd4bb5499896fe8edaf4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "permission_types_users_assn" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" character varying NOT NULL, "permissionTypeId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6ccd5d966349fabe00eac5e2a0a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "grants" DROP COLUMN "sponsorName"`);
        await queryRunner.query(`ALTER TABLE "grants" DROP COLUMN "sponsorUrl"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "grants" ADD "dateWhenFundsWereReceived" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "grants" ADD "expirationDate" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "grants" ADD "writerName" character varying`);
        await queryRunner.query(`ALTER TABLE "grants" ADD "applicationUrl" character varying`);
        await queryRunner.query(`ALTER TABLE "grants" ADD "sponsoringAgency" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "firstName" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD "lastName" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "grants" ALTER COLUMN "amountApproved" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "expenses" ADD CONSTRAINT "FK_87cd506c4869da655ade6fe60af" FOREIGN KEY ("grantId") REFERENCES "grants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "attachments" ADD CONSTRAINT "FK_b493d0d1a4fa357e3a778a26d0b" FOREIGN KEY ("grantId") REFERENCES "grants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "attachments" DROP CONSTRAINT "FK_b493d0d1a4fa357e3a778a26d0b"`);
        await queryRunner.query(`ALTER TABLE "expenses" DROP CONSTRAINT "FK_87cd506c4869da655ade6fe60af"`);
        await queryRunner.query(`ALTER TABLE "grants" ALTER COLUMN "amountApproved" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "lastName"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "firstName"`);
        await queryRunner.query(`ALTER TABLE "grants" DROP COLUMN "sponsoringAgency"`);
        await queryRunner.query(`ALTER TABLE "grants" DROP COLUMN "applicationUrl"`);
        await queryRunner.query(`ALTER TABLE "grants" DROP COLUMN "writerName"`);
        await queryRunner.query(`ALTER TABLE "grants" DROP COLUMN "expirationDate"`);
        await queryRunner.query(`ALTER TABLE "grants" DROP COLUMN "dateWhenFundsWereReceived"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "grants" ADD "sponsorUrl" character varying`);
        await queryRunner.query(`ALTER TABLE "grants" ADD "sponsorName" character varying`);
        await queryRunner.query(`DROP TABLE "permission_types_users_assn"`);
        await queryRunner.query(`DROP TABLE "permission_types"`);
        await queryRunner.query(`DROP TABLE "attachments"`);
        await queryRunner.query(`DROP TABLE "expenses"`);
    }

}

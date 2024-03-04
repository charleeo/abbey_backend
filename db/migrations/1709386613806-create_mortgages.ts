import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMortgages1709386613806 implements MigrationInterface {
    name = 'CreateMortgages1709386613806'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mortgages" ADD "life_cycle" character varying(30) NOT NULL DEFAULT 'start'`);
        await queryRunner.query(`ALTER TABLE "loans" ADD "mortgage" integer`);
        await queryRunner.query(`ALTER TABLE "loans" ALTER COLUMN "verification_status" SET DEFAULT 'approved'`);
        await queryRunner.query(`ALTER TABLE "loans" ADD CONSTRAINT "FK_d8669b25f611f1b7f3ffcfb5666" FOREIGN KEY ("mortgage") REFERENCES "mortgages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "loans" DROP CONSTRAINT "FK_d8669b25f611f1b7f3ffcfb5666"`);
        await queryRunner.query(`ALTER TABLE "loans" ALTER COLUMN "verification_status" SET DEFAULT 'pending'`);
        await queryRunner.query(`ALTER TABLE "loans" DROP COLUMN "mortgage"`);
        await queryRunner.query(`ALTER TABLE "mortgages" DROP COLUMN "life_cycle"`);
    }

}

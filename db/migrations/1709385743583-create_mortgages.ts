import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMortgages1709385743583 implements MigrationInterface {
    name = 'CreateMortgages1709385743583'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "mortgages" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(225) NOT NULL, "repayment_status" character varying(30) NOT NULL, "status" character varying(30) NOT NULL, "interest" character varying(30) NOT NULL, "price" numeric(15,2) NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_f2a7fd8957a9fa2b669a7e252c4" UNIQUE ("name"), CONSTRAINT "PK_5ca97f78106db808696b2dc2084" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "mortgages"`);
    }

}

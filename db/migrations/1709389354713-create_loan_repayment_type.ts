import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateLoanRepaymentType1709389354713 implements MigrationInterface {
    name = 'CreateLoanRepaymentType1709389354713'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "loan_repayment_types" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(225) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_b11904ef664d61ec6b0d1390a35" UNIQUE ("name"), CONSTRAINT "PK_1f0089ef854f4014cb196da4b87" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "loans" ADD "loanRepaymentPlan" integer`);
        await queryRunner.query(`ALTER TABLE "loans" ADD CONSTRAINT "FK_1f5d9af81015a786d6a8fe41d0e" FOREIGN KEY ("loanRepaymentPlan") REFERENCES "loan_repayment_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "loans" DROP CONSTRAINT "FK_1f5d9af81015a786d6a8fe41d0e"`);
        await queryRunner.query(`ALTER TABLE "loans" DROP COLUMN "loanRepaymentPlan"`);
        await queryRunner.query(`DROP TABLE "loan_repayment_types"`);
    }

}

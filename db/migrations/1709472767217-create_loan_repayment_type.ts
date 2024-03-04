import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateLoanRepaymentType1709472767217 implements MigrationInterface {
    name = 'CreateLoanRepaymentType1709472767217'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "loans" ALTER COLUMN "amount" TYPE numeric(15,2)`);
        await queryRunner.query(`ALTER TABLE "loans" ALTER COLUMN "interest" TYPE numeric(15,2)`);
        await queryRunner.query(`ALTER TABLE "loans" ALTER COLUMN "repayment_sum" TYPE numeric(15,2)`);
        await queryRunner.query(`ALTER TABLE "loans" ALTER COLUMN "expected_repayment_amount" TYPE numeric(15,2)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "loans" ALTER COLUMN "expected_repayment_amount" TYPE numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "loans" ALTER COLUMN "repayment_sum" TYPE numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "loans" ALTER COLUMN "interest" TYPE numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "loans" ALTER COLUMN "amount" TYPE numeric(10,2)`);
    }

}

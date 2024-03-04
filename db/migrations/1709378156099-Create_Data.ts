import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateData1709378156099 implements MigrationInterface {
    name = 'CreateData1709378156099'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "firstname" character varying, "lastname" character varying, "profile_picture" character varying DEFAULT 'images/no_image.png', "password" character varying NOT NULL, "phone" character varying, "address" text, "is_admin" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."loan_repayment_confirmation_status_enum" AS ENUM('confirmed', 'pending', 'disputed', 'declined')`);
        await queryRunner.query(`CREATE TABLE "loan_repayment" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "amount" numeric(10,2) NOT NULL DEFAULT '0', "repayment_reference" character varying, "confirmation_status" "public"."loan_repayment_confirmation_status_enum" NOT NULL DEFAULT 'pending', "comment" text, "repayments_data" jsonb NOT NULL DEFAULT '{}', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "isDeleted" boolean NOT NULL DEFAULT false, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "loan_id" integer, CONSTRAINT "PK_5a628a0f3e911ce163c602fcace" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."loans_verification_status_enum" AS ENUM('approved', 'pending', 'reviewed', 'declined')`);
        await queryRunner.query(`CREATE TYPE "public"."loans_interest_payment_status_enum" AS ENUM('paid', 'not_paid')`);
        await queryRunner.query(`CREATE TABLE "loans" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "customer_id" integer NOT NULL, "amount" numeric(10,2) NOT NULL DEFAULT '0', "interest" numeric(10,2) NOT NULL DEFAULT '0', "repayment_sum" numeric(10,2) NOT NULL DEFAULT '0', "expected_repayment_amount" numeric(10,2) NOT NULL DEFAULT '0', "repayment_rate" character varying NOT NULL DEFAULT '0', "repayment_percentage" character varying NOT NULL DEFAULT '0%', "repayment_intervals" character varying NOT NULL DEFAULT '0', "repayment_due_date" date, "repayment_start_date" date, "issue_date" date, "reference" character varying NOT NULL, "comment" text, "verification_status" "public"."loans_verification_status_enum" NOT NULL DEFAULT 'pending', "interest_payment_status" "public"."loans_interest_payment_status_enum" NOT NULL DEFAULT 'paid', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "loan_duration_category" integer, CONSTRAINT "PK_5c6942c1e13e4de135c5203ee61" PRIMARY KEY ("id")); COMMENT ON COLUMN "loans"."expected_repayment_amount" IS 'the loaned amount plus the loan interest'`);
        await queryRunner.query(`CREATE TABLE "loan_repayment_duration_categoriess" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "category_name" character varying(225) NOT NULL, "category_tagline" character varying(225) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_2dc5286a85a24fbd60e0a1e8d37" UNIQUE ("category_name"), CONSTRAINT "UQ_a6cc779f35b9a82bd7f5dc1e845" UNIQUE ("category_tagline"), CONSTRAINT "PK_54b84b3bc54bb4c299b3e244871" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "roles" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "role_name" character varying(225) NOT NULL, "role" character varying(225) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_ccc7c1489f3a6b3c9b47d4537c5" UNIQUE ("role"), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "loan_repayment" ADD CONSTRAINT "FK_1a9c1d5b6f896d7e4e5354a6a21" FOREIGN KEY ("loan_id") REFERENCES "loans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "loans" ADD CONSTRAINT "FK_b73644771c5726370ae9a7eb1a4" FOREIGN KEY ("loan_duration_category") REFERENCES "loan_repayment_duration_categoriess"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "loans" DROP CONSTRAINT "FK_b73644771c5726370ae9a7eb1a4"`);
        await queryRunner.query(`ALTER TABLE "loan_repayment" DROP CONSTRAINT "FK_1a9c1d5b6f896d7e4e5354a6a21"`);
        await queryRunner.query(`DROP TABLE "roles"`);
        await queryRunner.query(`DROP TABLE "loan_repayment_duration_categoriess"`);
        await queryRunner.query(`DROP TABLE "loans"`);
        await queryRunner.query(`DROP TYPE "public"."loans_interest_payment_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."loans_verification_status_enum"`);
        await queryRunner.query(`DROP TABLE "loan_repayment"`);
        await queryRunner.query(`DROP TYPE "public"."loan_repayment_confirmation_status_enum"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}

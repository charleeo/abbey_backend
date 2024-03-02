import { MigrationInterface, QueryRunner } from "typeorm";

export class DEV1708549817704 implements MigrationInterface {
    name = 'DEV1708549817704'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."kyc_gender_enum" AS ENUM('male', 'female', 'othere')`);
        await queryRunner.query(`CREATE TYPE "public"."kyc_kyc_verification_status_enum" AS ENUM('verified', 'not_verified', 'pending', 'reviewed')`);
        await queryRunner.query(`CREATE TYPE "public"."kyc_kyc_level_enum" AS ENUM('1', '2', '3')`);
        await queryRunner.query(`CREATE TABLE "kyc" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "bvn" character varying, "phone" character varying, "nin" character varying, "gender" "public"."kyc_gender_enum" DEFAULT 'male', "firstname" character varying(225) NOT NULL, "lastname" character varying(225), "address" text NOT NULL, "kyc_verification_status" "public"."kyc_kyc_verification_status_enum" NOT NULL DEFAULT 'pending', "kyc_level" "public"."kyc_kyc_level_enum" NOT NULL DEFAULT '1', "id_card" character varying, "id_card_type" character varying, "remark" text, "user_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "UQ_eae0f69fb1b7097c4f0a25efd66" UNIQUE ("bvn"), CONSTRAINT "UQ_941b7a6c477a32a2b0aca2dac3d" UNIQUE ("nin"), CONSTRAINT "UQ_99797bb751811331b74d27865f3" UNIQUE ("user_id"), CONSTRAINT "REL_ca948073ed4a3ba22030d37b3d" UNIQUE ("userId"), CONSTRAINT "PK_84ab2e81ea9700d29dda719f3be" PRIMARY KEY ("id")); COMMENT ON COLUMN "kyc"."bvn" IS 'the client''s bank verification number'; COMMENT ON COLUMN "kyc"."nin" IS 'User national identity number'; COMMENT ON COLUMN "kyc"."address" IS 'Business or house address'; COMMENT ON COLUMN "kyc"."kyc_verification_status" IS 'verified is verified and no is not verified, review is when it is under review'; COMMENT ON COLUMN "kyc"."kyc_level" IS 'All newly created users will be on level one untill verified'`);
        await queryRunner.query(`CREATE TYPE "public"."user_roles_status_enum" AS ENUM('1', '0')`);
        await queryRunner.query(`CREATE TABLE "user_roles" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "roleId" integer NOT NULL, "actions" json NOT NULL, "dutyId" integer NOT NULL, "status" "public"."user_roles_status_enum" NOT NULL DEFAULT '1', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "REL_472b25323af01488f1f66a06b6" UNIQUE ("userId"), CONSTRAINT "PK_8acd5cf26ebd158416f477de799" PRIMARY KEY ("id")); COMMENT ON COLUMN "user_roles"."status" IS '1 means active status. O means inactive status'`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "firstname" character varying, "username" character varying, "lastname" character varying, "profile_picture" character varying DEFAULT 'images/no_image.png', "password" character varying NOT NULL, "phone" character varying, "address" text, "is_admin" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "loan_types" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" character varying(225) NOT NULL, "description" character varying(225) NOT NULL, "status" character varying(225) NOT NULL, CONSTRAINT "UQ_f01bc0ab1212be820cfbe0f3604" UNIQUE ("type"), CONSTRAINT "PK_9f880f598e36617b7ba4ea096a4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."loan_repayment_confirmation_status_enum" AS ENUM('confirmed', 'pending', 'disputed', 'declined')`);
        await queryRunner.query(`CREATE TABLE "loan_repayment" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "amount" numeric(10,2) NOT NULL DEFAULT '0', "repayment_reference" character varying, "confirmation_status" "public"."loan_repayment_confirmation_status_enum" NOT NULL DEFAULT 'pending', "comment" text, "repayments_data" jsonb NOT NULL DEFAULT '{}', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "isDeleted" boolean NOT NULL DEFAULT false, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "loan_id" integer, CONSTRAINT "PK_5a628a0f3e911ce163c602fcace" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."loans_verification_status_enum" AS ENUM('approved', 'pending', 'reviewed', 'declined')`);
        await queryRunner.query(`CREATE TYPE "public"."loans_interest_payment_status_enum" AS ENUM('paid', 'not_paid')`);
        await queryRunner.query(`CREATE TABLE "loans" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "customer_id" integer NOT NULL, "amount" numeric(10,2) NOT NULL DEFAULT '0', "interest" numeric(10,2) NOT NULL DEFAULT '0', "repayment_sum" numeric(10,2) NOT NULL DEFAULT '0', "expected_repayment_amount" numeric(10,2) NOT NULL DEFAULT '0', "repayment_rate" character varying NOT NULL DEFAULT '0', "repayment_percentage" character varying NOT NULL DEFAULT '0%', "repayment_intervals" character varying NOT NULL DEFAULT '0', "repayment_due_date" date, "repayment_start_date" date, "issue_date" date, "reference" character varying NOT NULL, "comment" text, "verification_status" "public"."loans_verification_status_enum" NOT NULL DEFAULT 'pending', "interest_payment_status" "public"."loans_interest_payment_status_enum" NOT NULL DEFAULT 'paid', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "loan_duration_category" integer, "loan_type" integer, CONSTRAINT "PK_5c6942c1e13e4de135c5203ee61" PRIMARY KEY ("id")); COMMENT ON COLUMN "loans"."expected_repayment_amount" IS 'the loaned amount plus the loan interest'`);
        await queryRunner.query(`CREATE TABLE "loan_repayment_duration_categoriess" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "category_name" character varying(225) NOT NULL, "category_tagline" character varying(225) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_2dc5286a85a24fbd60e0a1e8d37" UNIQUE ("category_name"), CONSTRAINT "UQ_a6cc779f35b9a82bd7f5dc1e845" UNIQUE ("category_tagline"), CONSTRAINT "PK_54b84b3bc54bb4c299b3e244871" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "locations" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "locationName" character varying(225) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_64deeae420dee5595cf7688a8ed" UNIQUE ("locationName"), CONSTRAINT "PK_7cc1c9e3853b94816c094825e74" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "duties" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(225) NOT NULL, CONSTRAINT "UQ_7acf009b32746fae7b709d6d2ad" UNIQUE ("name"), CONSTRAINT "PK_f35c74c0ad8c80299ca5d511f95" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "actions" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "actions" character varying(225) NOT NULL, "tag_line" character varying(225) NOT NULL, CONSTRAINT "UQ_162d4e1f58b6d489b08889521b9" UNIQUE ("tag_line"), CONSTRAINT "PK_7bfb822f56be449c0b8adbf83cf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "roles" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "role_name" character varying(225) NOT NULL, "role" character varying(225) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_ccc7c1489f3a6b3c9b47d4537c5" UNIQUE ("role"), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "loan_setting" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "client_id" integer NOT NULL, "application_password" character varying, "receiving_account" character varying, "receiving_bank" character varying, "default_loan_type" integer, CONSTRAINT "PK_ac5cd93fa34abb2e2831719191c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "id_cards" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(225) NOT NULL, CONSTRAINT "UQ_4526637b211a4159bc8bad5edf3" UNIQUE ("name"), CONSTRAINT "PK_f2773eeab4a00cdba99cc155396" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "kyc" ADD CONSTRAINT "FK_ca948073ed4a3ba22030d37b3db" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD CONSTRAINT "FK_472b25323af01488f1f66a06b67" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "loan_repayment" ADD CONSTRAINT "FK_1a9c1d5b6f896d7e4e5354a6a21" FOREIGN KEY ("loan_id") REFERENCES "loans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "loans" ADD CONSTRAINT "FK_b73644771c5726370ae9a7eb1a4" FOREIGN KEY ("loan_duration_category") REFERENCES "loan_repayment_duration_categoriess"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "loans" ADD CONSTRAINT "FK_f550cfc31c3ef1c9b0d9b0eb050" FOREIGN KEY ("loan_type") REFERENCES "loan_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "loans" DROP CONSTRAINT "FK_f550cfc31c3ef1c9b0d9b0eb050"`);
        await queryRunner.query(`ALTER TABLE "loans" DROP CONSTRAINT "FK_b73644771c5726370ae9a7eb1a4"`);
        await queryRunner.query(`ALTER TABLE "loan_repayment" DROP CONSTRAINT "FK_1a9c1d5b6f896d7e4e5354a6a21"`);
        await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_472b25323af01488f1f66a06b67"`);
        await queryRunner.query(`ALTER TABLE "kyc" DROP CONSTRAINT "FK_ca948073ed4a3ba22030d37b3db"`);
        await queryRunner.query(`DROP TABLE "id_cards"`);
        await queryRunner.query(`DROP TABLE "loan_setting"`);
        await queryRunner.query(`DROP TABLE "roles"`);
        await queryRunner.query(`DROP TABLE "actions"`);
        await queryRunner.query(`DROP TABLE "duties"`);
        await queryRunner.query(`DROP TABLE "locations"`);
        await queryRunner.query(`DROP TABLE "loan_repayment_duration_categoriess"`);
        await queryRunner.query(`DROP TABLE "loans"`);
        await queryRunner.query(`DROP TYPE "public"."loans_interest_payment_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."loans_verification_status_enum"`);
        await queryRunner.query(`DROP TABLE "loan_repayment"`);
        await queryRunner.query(`DROP TYPE "public"."loan_repayment_confirmation_status_enum"`);
        await queryRunner.query(`DROP TABLE "loan_types"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "user_roles"`);
        await queryRunner.query(`DROP TYPE "public"."user_roles_status_enum"`);
        await queryRunner.query(`DROP TABLE "kyc"`);
        await queryRunner.query(`DROP TYPE "public"."kyc_kyc_level_enum"`);
        await queryRunner.query(`DROP TYPE "public"."kyc_kyc_verification_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."kyc_gender_enum"`);
    }

}

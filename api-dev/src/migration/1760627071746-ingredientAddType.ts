import {MigrationInterface, QueryRunner} from "typeorm";

export class ingredientAddType1760627071746 implements MigrationInterface {
    name = 'ingredientAddType1760627071746'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."ingredient_tag_enum" AS ENUM('légumes', 'protéine', 'féculent')`);
        await queryRunner.query(`ALTER TABLE "ingredient" ADD "tag" "public"."ingredient_tag_enum" NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ingredient" DROP COLUMN "tag"`);
        await queryRunner.query(`DROP TYPE "public"."ingredient_tag_enum"`);
    }

}

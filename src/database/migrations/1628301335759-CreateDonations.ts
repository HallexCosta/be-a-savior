import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreateDonations1628301335759 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'donations',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true
          },
          {
            name: 'incident_id',
            type: 'varchar'
          },
          {
            name: 'donor_id',
            type: 'varchar'
          },
          {
            name: 'created_at',
            type: 'date',
            default: 'now()'
          },
          {
            name: 'updated_at',
            type: 'date',
            default: 'now()'
          }
        ]
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('donations')
  }
}

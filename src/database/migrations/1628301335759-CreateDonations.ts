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
            type: 'uuid'
          },
          {
            name: 'donor_id',
            type: 'uuid'
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
        ],
        foreignKeys: [
          {
            name: 'FKIncidentIdDonations',
            referencedTableName: 'incidents',
            referencedColumnNames: ['id'],
            columnNames: ['incident_id'],
            onDelete: 'SET NULL',
            onUpdate: 'SET NULL'
          },
          {
            name: 'FKDonorIdDonations',
            referencedTableName: 'donors',
            referencedColumnNames: ['id'],
            columnNames: ['donor_id'],
            onDelete: 'SET NULL',
            onUpdate: 'SET NULL'
          }
        ]
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('donations')
  }
}

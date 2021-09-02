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
            name: 'ong_id',
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
        ],
        foreignKeys: [
          {
            name: 'FKIncidentDonations',
            referencedTableName: 'incidents',
            referencedColumnNames: ['id'],
            columnNames: ['incident_id'],
            onDelete: 'SET NULL',
            onUpdate: 'SET NULL'
          },
          {
            name: 'FKDonorDonations',
            referencedTableName: 'donors',
            referencedColumnNames: ['id'],
            columnNames: ['donor_id'],
            onDelete: 'SET NULL',
            onUpdate: 'SET NULL'
          },
          {
            name: 'FKOngDonations',
            referencedTableName: 'ongs',
            referencedColumnNames: ['id'],
            columnNames: ['ong_id'],
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

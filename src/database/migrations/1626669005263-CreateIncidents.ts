import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreateIncidents1626669005263 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'incidents',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true
          },
          {
            name: 'name',
            type: 'string'
          },
          {
            name: 'cost',
            type: 'float'
          },
          {
            name: 'description',
            type: 'varchar'
          },
          {
            name: 'ong_id',
            type: 'uuid'
          },
          {
            name: 'donation_id',
            type: 'uuid',
            isNullable: true
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()'
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()'
          }
        ],
        foreignKeys: [
          {
            name: 'FKOngIdIncidents',
            referencedTableName: 'ongs',
            referencedColumnNames: ['id'],
            columnNames: ['ong_id'],
            onDelete: 'SET NULL',
            onUpdate: 'SET NULL'
          },
          {
            name: 'FKDonationIdIncidents',
            referencedTableName: 'donations',
            referencedColumnNames: ['id'],
            columnNames: ['donation_id'],
            onDelete: 'SET NULL',
            onUpdate: 'SET NULL'
          }
        ]
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('incidents')
  }
}

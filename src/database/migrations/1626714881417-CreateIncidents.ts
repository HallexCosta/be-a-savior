import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreateIncidents1626714881417 implements MigrationInterface {
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
            type: 'varchar'
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
          }
        ]
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('incidents')
  }
}

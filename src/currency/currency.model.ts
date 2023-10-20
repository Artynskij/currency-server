import { Table, Model, Column } from 'sequelize-typescript';

@Table
export class Currency extends Model {
  @Column
  name: string;
  @Column
  price: string;
  @Column
  client: boolean;
}

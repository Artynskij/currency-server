import { Table, Model, Column } from 'sequelize-typescript';

@Table
export class Bank extends Model {
  @Column
  name: string;
  @Column
  logo: string;
  @Column
  codename: string;
  @Column
  idbank: number;
}

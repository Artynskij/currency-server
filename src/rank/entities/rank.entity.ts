import { Table, Model, Column } from 'sequelize-typescript';

@Table
export class Rank extends Model {
  @Column
  codename: string;
  @Column
  selrate: string;
  @Column
  seliso: string;
  @Column
  buyrate: string;
  @Column
  buyiso: string;
  @Column
  quantity: number;
  @Column
  name: string;
}

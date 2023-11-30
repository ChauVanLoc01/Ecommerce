/* eslint-disable prettier/prettier */

import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  name : string;

  @Column()
  priceBefore  : number;
  @Column()
  priceAfter  : number;
  @Column()
  initQuantity  : number;

  @Column()
  currentQuantity   : number;

  @Column()
  description   : string;

  @Column()
  status   : number;

  @Column()
  createdBy   : string;


  @Column({ default: true })
  isActive: boolean;


}
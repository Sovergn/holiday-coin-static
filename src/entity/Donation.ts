import * as _ from "lodash";
import { BaseEntity, Entity, PrimaryColumn, Column, BeforeUpdate, BeforeInsert } from "typeorm";
import { ExtendedColumnOptions } from "typeorm-encrypted";
import * as moment from "moment";
import config from "../config";
import { web3 } from "../eth";
import { DonationStatus, SourceType } from "../types/enums";
import { ValidationError, ValidationErrorCode } from "./errors";

@Entity()
export class Donation extends BaseEntity {
  @PrimaryColumn({
    type: "varchar"
  })
  address: string;

  @Column(<ExtendedColumnOptions>{
    type: "varchar",
    nullable: false,
    encrypt: {
      key: config.get("secret"),
      algorithm: "aes-256-cbc",
      ivLength: 16
    }
  })
  secret: string;

  @Column({
    type: "smallint",
    nullable: false
  })
  type: SourceType;

  @Column({
    type: "varchar",
    nullable: false
  })
  id: string;

  @Column({
    name: "amount",
    type: "decimal",
    precision: 27,
    scale: 18,
    nullable: true
  })
  amount: number;

  @Column({
    type: "varchar",
    nullable: false
  })
  email: string;

  @Column({
    name: "first_name",
    type: "varchar",
    nullable: true
  })
  firstName: string;

  @Column({
    name: "last_name",
    type: "varchar",
    nullable: true
  })
  lastName: string;

  @Column({
    type: "varchar",
    nullable: true
  })
  country: string;

  @Column({
    type: "varchar",
    nullable: true
  })
  state: string;

  @Column({
    type: "varchar",
    nullable: true
  })
  charity: string;

  @Column({
    type: "smallint",
    nullable: false,
    default: DonationStatus.PENDING
  })
  status: DonationStatus;

  @Column({
    name: "created_at",
    type: "int",
    nullable: false
  })
  createdAt: number;

  @Column({
    name: "updated_at",
    type: "int",
    nullable: false
  })
  updatedAt: number;

  @BeforeUpdate()
  updateListener() {
    this.updatedAt = moment().unix();
  }

  @BeforeInsert()
  insertListener() {
    let { privateKey, address } = web3.eth.accounts.create();
    this.address = address;
    this.secret = privateKey;
    this.updatedAt = moment().unix();
    this.createdAt = this.updatedAt;
  }
}


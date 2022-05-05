import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, BaseEntity } from "typeorm";
import { User } from "./User";

@Entity({
  name: "customers",
})
export class Customer extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  enabled: number;

  @ManyToOne(() => User)
  @JoinColumn({
    name: "created_by",
    referencedColumnName: "id",
  })
  created_by: Promise<User>;

  @Column()
  created_at: Date;
}

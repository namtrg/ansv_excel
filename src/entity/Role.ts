import { BaseEntity, Column, Entity, JoinColumn, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Entity({
  name: "role",
})
export class Role extends BaseEntity {
  /**`id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL, */
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany((type) => User, (user) => user.roles)
  users: Promise<User[]>;
}
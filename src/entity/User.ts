import { BaseEntity, Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PIC } from "./PIC";
import { Role } from "./Role";


@Entity({
  name: "users",
})
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  display_name: string;

  @Column()
  enabled: number;

  @Column()
  level: number;

  @Column()
  created_at: Date;

  @Column()
  created_by: string;

  @ManyToMany((type) => Role, (role) => role.users)
  @JoinTable({
    name: "users_roles",
    joinColumn: {
      name: "user",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "role",
      referencedColumnName: "id",
    },
  })
  roles: Promise<Role[]>;

  @OneToMany((type) => PIC, (pic) => pic.pics)
  pics: Promise<PIC[]>;
}
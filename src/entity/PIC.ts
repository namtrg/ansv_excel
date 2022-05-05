import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, BaseEntity } from "typeorm";
import { Project } from "./Project";
import { User } from "./User";

@Entity({
  name: "pic",
})
export class PIC extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Project, (project) => project.pics)
  @JoinColumn({
    name: "project_id",
  })
  project: Promise<Project>;

  @ManyToOne(() => User, (user) => user.pics)
  @JoinColumn({
    name: "pic",
  })
  pics: Promise<User>;

  @Column()
  note: string;
}

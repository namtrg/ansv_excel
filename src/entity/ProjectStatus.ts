import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({
  name: "projects_status",
})
export class ProjectStatus extends BaseEntity {
  /*
  id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  */
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
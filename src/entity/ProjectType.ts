import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Project } from "./Project";

@Entity({
  name: "projects_types",
})
export class ProjectType extends BaseEntity {
  /**
 * `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `display` varchar(100) DEFAULT NULL,
 */
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  display: string;

  @OneToMany((type) => Project, (project) => project.project_type)
  projects: Promise<Project[]>;
}
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm"

@Entity({
  name: "priorities",
})
export class Priorities extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}

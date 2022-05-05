import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Customer } from "./Customer";
import { PIC } from "./PIC";
import { ProjectStatus } from "./ProjectStatus";
import { ProjectType } from "./ProjectType";


@Entity({
  name: "project",
})
export class Project extends BaseEntity {
  /**
  `id` int NOT NULL AUTO_INCREMENT,
  `project_type` int DEFAULT NULL,
  `priority` int DEFAULT NULL,
  `project_status` int DEFAULT NULL,
  `customer` int DEFAULT NULL,
  `week` int DEFAULT NULL,
  `year` int DEFAULT NULL,
  `projects_id` varchar(100) DEFAULT NULL,
  `ma_so_ke_toan` varchar(20) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` text,
  `tong_muc_dau_tu_du_kien` varchar(50) DEFAULT NULL,
  `hinh_thuc_dau_tu` varchar(255) DEFAULT NULL,
  `muc_do_kha_thi` int DEFAULT NULL,
  `phan_tich_SWOT` text,
  `pham_vi_cung_cap` text,
  `tong_gia_tri_thuc_te` double DEFAULT NULL,
  `DAC` date DEFAULT NULL,
  `PAC` date DEFAULT NULL,
  `FAC` date DEFAULT NULL,
  `so_tien_tam_ung` double DEFAULT NULL,
  `ke_hoach_tam_ung` date DEFAULT NULL,
  `so_tien_DAC` double DEFAULT NULL,
  `ke_hoach_thanh_toan_DAC` date DEFAULT NULL,
  `thuc_te_thanh_toan_DAC` date DEFAULT NULL,
  `so_tien_PAC` double DEFAULT NULL,
  `ke_hoach_thanh_toan_PAC` date DEFAULT NULL,
  `thuc_te_thanh_toan_PAC` date DEFAULT NULL,
  `so_tien_FAC` double DEFAULT NULL,
  `ke_hoach_thanh_toan_FAC` date DEFAULT NULL,
  `thuc_te_thanh_toan_FAC` date DEFAULT NULL,
  `tinh_trang_va_ke_hoach_chi_tiet` text,
  `ke_hoach` text,
  `general_issue` text CHARACTER SET utf8 COLLATE utf8_general_ci,
  `solution` text,
  `ket_qua_thuc_hien_ke_hoach` text,
  `note` longtext,
  `interactive` varchar(50) DEFAULT NULL,
  `created_at` date DEFAULT NULL,
   */
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => ProjectType)
  @JoinColumn({ name: "project_type" })
  project_type: Promise<ProjectType>;

  @ManyToOne((type) => ProjectStatus)
  @JoinColumn({ name: "project_status" })
  project_status: Promise<ProjectStatus>;

  @ManyToOne((type) => Customer)
  @JoinColumn({ name: "customer" })
  customer: Promise<Customer>;

  @Column()
  priority: number;

  @Column()
  week: number;

  @Column()
  year: number;

  @Column()
  @Column()
  projects_id: string;

  @Column()
  ma_so_ke_toan: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  tong_muc_dau_tu_du_kien: string;

  @Column()
  hinh_thuc_dau_tu: string;

  @Column()
  muc_do_kha_thi: number;

  @Column()
  phan_tich_SWOT: string;

  @Column()
  pham_vi_cung_cap: string;

  @Column()
  tong_gia_tri_thuc_te: number;

  @Column()
  DAC: Date;

  @Column()
  PAC: Date;

  @Column()
  FAC: Date;

  @Column()
  so_tien_tam_ung: number;

  @Column()
  ke_hoach_tam_ung: Date;

  @Column()
  so_tien_DAC: number;

  @Column()
  ke_hoach_thanh_toan_DAC: Date;

  @Column()
  thuc_te_thanh_toan_DAC: Date;

  @Column()
  so_tien_PAC: number;

  @Column()
  ke_hoach_thanh_toan_PAC: Date;

  @Column()
  thuc_te_thanh_toan_PAC: Date;

  @Column()
  so_tien_FAC: number;

  @Column()
  ke_hoach_thanh_toan_FAC: Date;

  @Column()
  thuc_te_thanh_toan_FAC: Date;

  @Column()
  tinh_trang_va_ke_hoach_chi_tiet: string;

  @Column()
  ke_hoach: string;

  @Column()
  general_issue: string;

  @Column()
  solution: string;

  @Column()
  ket_qua_thuc_hien_ke_hoach: string;

  @Column()
  note: string;

  @Column()
  interactive: string;

  @Column()
  created_at: Date;

  @OneToMany((type) => PIC, (pic) => pic.project)
  @JoinColumn({ name: "project_id" })
  pics: Promise<PIC[]>;
}
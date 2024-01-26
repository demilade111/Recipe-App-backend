import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Users } from "./User";

@Entity()
export class Recipe {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  title: string;

  @Column("text", { nullable: true })
  description: string;

  @Column("text", { nullable: true })
  photo: string;

  @Column({ nullable: true })
  yield: string;

  @Column({ nullable: true })
  activeTime: string;

  @Column({ nullable: true })
  totalTime: string;

  @Column({ type: "int", nullable: true })
  rating: number;

  @Column({ nullable: true })
  source: string;

  @Column({ nullable: true })
  sourceUrl: string;

  @Column({ type: "varchar", nullable: true })
  pictureUrl: string | null;

  @Column("text", { nullable: true })
  ingredients: string;

  @Column("text", { nullable: true })
  instructions: string;

  @Column("text", { nullable: true })
  note: string;

  @ManyToOne(() => Users, (user) => user.recipes, { nullable: true })
  user: Users;
}

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Users } from './User';

@Entity()
export class Recipe {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  title: string;

  @Column("text")
  description: string;

  @Column("text")
  photo: string;

  @Column()
  yield: string;

  @Column()
  activeTime: string;

  @Column()
  totalTime: string;

  @Column({ type: "int" })
  rating: number;

  @Column()
  source: string;

  @Column()
  sourceUrl: string;
 
  @Column({ type: "varchar", nullable: true })
  pictureUrl: string | null; // Optional column fo

  @Column("text")
  ingredients: string;

  @Column("text")
  instructions: string;

  @Column("text")
  note: string;

  // ManyToOne relationship with User
  @ManyToOne(() => Users, (user) => user.recipes)
  user: Users;
}

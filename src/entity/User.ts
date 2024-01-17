import { Recipe } from "./Recipe";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 255 }) // Modify the length as needed
  fullname: string;

  @Column({ type: "varchar", unique: true, length: 255 }) // Modify the length as needed
  email: string;

  @Column({ type: "text" }) // Use "text" type for password
  password: string;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ type: "varchar", nullable: true })
  emailValidationToken: string | null;

  @Column({ type: "timestamp", nullable: true })
  emailVerificationTokenExpires: Date | null;

  @Column({ type: "varchar", nullable: true })
  passwordResetToken: string | null;

  @Column({ type: "timestamp", nullable: true })
  passwordResetTokenExpires: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Recipe, (recipe) => recipe.user)
  recipes: Recipe[];
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeUpdate,
  BeforeInsert,
} from "typeorm";
import bcrypt from "bcrypt";

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

  @BeforeInsert()
  @BeforeUpdate()
  async hashpasssword(): Promise<void> {
    if (this.password) {
      // The '10' is the number of rounds for salt generation
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
  }
  checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
    return bcrypt.compareSync(unencryptedPassword, this.password);
  }
  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ nullable: true })
  emailValidationToken: string;
  @Column({ nullable: true })
  emailVerificationTokenExpires: Date;
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

import { ObjectId } from 'mongodb';
import { Column, Entity, ObjectIdColumn } from 'typeorm';

@Entity()
export class User {
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: 0 })
  loginAttempts: number;

  @Column({ nullable: true })
  lastLoginAttempt: Date;

  @Column({ default: false })
  isLocked: boolean;

  @Column({ nullable: true })
  lockUntil: Date;
}

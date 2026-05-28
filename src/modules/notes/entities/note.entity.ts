import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'notes' })
export class NoteEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 80 })
  title!: string;

  @Column({ length: 500 })
  content!: string;

  @Column({ type: 'datetime' })
  createdAt!: Date;
}

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from './entities/member.entity';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { parse } from 'csv-parse/sync';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member)
    private readonly repository: Repository<Member>,
  ) {}

  async create(dto: CreateMemberDto) {
    const entity = this.repository.create(dto as Partial<Member>);
    // prend la liste des tout les membres
    const listMembers = await this.findAll();

    // boucle pour verifier si le nouveau membre a une dateOfBirth deja existante
    for (let index = 0; index < listMembers.length; index++) {

      let member = listMembers[index];

      if (member.dateOfBirth == entity.dateOfBirth) {
        return;
      }
    }

    return this.repository.save(entity);

  }

  findAll() {
    return this.repository.find({ relations: ['memberships'] });
  }

  async findOne(id: string | number) {
    const entity = await this.repository.findOne({ where: { id } as any, relations: ['memberships'] });
    if (!entity) throw new NotFoundException(`Member ${id} introuvable`);
    return entity;
  }

  async update(id: string | number, dto: UpdateMemberDto) {
    const entity = await this.findOne(id);
    Object.assign(entity, dto);
    return this.repository.save(entity);
  }

  async remove(id: string | number) {
    const entity = await this.findOne(id);
    await this.repository.remove(entity);
    return entity;
  }

  async importCsv(buffer: Buffer) {
    let records: Record<string, string>[];
    try {
      // columns: true -> the first line gives the column names
      // delimiter: accepts "," and ";" (Excel in French uses ";")
      records = parse(buffer, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
        bom: true,
        delimiter: [',', ';'],
      });
    } catch {
      throw new BadRequestException('Fichier CSV illisible');
    }

    const valid: Partial<Member>[] = [];
    const errors: { line: number; message: string }[] = [];

    records.forEach((row, i) => {
      const line = i + 2; // +1 for the header, +1 because lines start at 1
      if (!row.name) {
        errors.push({ line, message: 'name est obligatoire' });
        return;
      }
      if (row.email && !/^\S+@\S+\.\S+$/.test(row.email)) {
        errors.push({ line, message: `email invalide : ${row.email}` });
        return;
      }
      if (row.dateOfBirth && Number.isNaN(Date.parse(row.dateOfBirth))) {
        errors.push({ line, message: `dateOfBirth invalide : ${row.dateOfBirth} (format AAAA-MM-JJ)` });
        return;
      }
      valid.push({
        name: row.name,
        firstname: row.firstname || null,
        email: row.email || null,
        phone: row.phone || null,
        dateOfBirth: row.dateOfBirth ? new Date(row.dateOfBirth) : null,
      });
    });

    await this.repository.save(this.repository.create(valid));
    return { imported: valid.length, errors };
  }
}

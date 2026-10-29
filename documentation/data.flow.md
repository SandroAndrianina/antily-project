1. vue-crud/src/pages/MemberList.vue (the front end)

onMounted(load) runs when the page opens, like a CI4 controller index().
load() calls apiClient.list('member').
The result goes into rows (a ref). The <tr v-for> loop in the template displays it.
Question: which variable holds the data shown in the table?

2. vue-crud/src/api/client.ts

list('member') becomes fetch('http://localhost:3000/member').
Question: which HTTP method does it use, and what does it return?

3. nestjs/src/member/member.controller.ts (the route)

@Controller('member') + @Get() equals the route GET /member, so it is your Routes.php and controller in one.
findAll() calls the service.
Question: which method handles GET /member/5?

4. nestjs/src/member/member.service.ts (the logic)

this.repository.find({ relations: ['memberships'] }) is $model->findAll() plus a join.
repository is injected in the constructor (dependency injection, instead of new Model()).
Question: what happens if findOne finds nothing?

5. nestjs/src/member/entities/member.entity.ts (the table)

@Entity('member') is the table, and each @Column is a field.
Question: which field is the primary key, and what type is it?

6. nestjs/src/member/member.module.ts

TypeOrmModule.forFeature([Member]) makes the Member repository available to the service.
It is a bit like declaring in CI4 which model a controller can use.
I'll unzip your project and look at its structure first.

I read the whole project. It has a NestJS back end (TypeScript, Postgres, TypeORM) and a Vue 3 front end. `Login.vue` and `Register.vue` already exist, but they are static: the submit button only redirects, with no authentication.

## CI4 → NestJS

| CI4 | NestJS |
|---|---|
| `public/index.php` | `main.ts` (starts the app, enables CORS) |
| `Routes.php` | Decorators on controllers: `@Controller('member')` + `@Get()`, `@Post()`… |
| Controller | `*.controller.ts` (receives the request, calls the service) |
| Model or Library | `*.service.ts` (logic) plus the TypeORM `Repository` (`find`, `save`) |
| Entity or Migration | `entities/*.entity.ts`, and the tables are created automatically (`synchronize: true`) |
| `$validationRules` | `dto/*.dto.ts` (class-validator) |
| Filters (auth) | **Guards**, which is what you'll use for authentication |
| `Config/*` and Autoload | `app.module.ts` plus one `*.module.ts` per feature |
| Constructor `new X()` or `Services::` | Dependency injection in the constructor |

## Vue → CI4

- `router/index.ts` works like `Routes.php`.
- `AppLayout.vue` is your layout, and `<router-view>` is where the page goes.
- Each `pages/*.vue` file is a view plus its mini-controller.
- `ref()` is a variable that refreshes the screen when it changes.
- `onMounted` runs when the page opens.
- `v-model` binds an input to a variable, `v-for` is a loop, and `v-if` is a condition.
- `api/client.ts` is the single place that calls the back end.

## Step by step

**Phase 1: run it (do this first, and tell me when it works)**
1. Start Postgres: `docker run -d --name pg -e POSTGRES_PASSWORD=pass -e POSTGRES_DB=app -p 5432:5432 postgres`
2. In `nestjs/`: `cp .env.example .env`, set `DATABASE_PASSWORD=pass`, then run `npm i && npm run start:dev`. Skip `init.sql`: its snake_case columns don't match the entities, and TypeORM creates the tables itself.
3. In `vue-crud/`: `npm i && npm run dev`.
4. Open the front end, go to `/member`, and create a member.

**Phase 2: trace one feature.** Follow `member` end to end: `MemberList.vue` → `apiClient` → `member.controller.ts` → `member.service.ts` → `member.entity.ts`.

**Phase 3: authentication**
1. Back end: `npm i @nestjs/jwt bcrypt`, plus `-D @types/bcrypt`.
2. Create a `User` entity (`email`, `passwordHash`).
3. Create an `auth` module with `POST /auth/register` (hash the password) and `POST /auth/login` (return a JWT).
4. Write a `JwtAuthGuard` and apply it to all routes except `/auth/*`.
5. Front end: `Login.vue` calls `/auth/login` and stores the token in `localStorage`.
6. `client.ts` adds the `Authorization: Bearer …` header.
7. `router.beforeEach` redirects to `/login` if there is no token.

**Phase 4: CSV import**
1. Back end: `npm i csv-parse` and `npm i -D @types/multer`.
2. Add `POST /member/import` using `@UseInterceptors(FileInterceptor('file'))`, parse the CSV, and `save` the rows.
3. Front end: add a `<input type="file">` to `MemberList.vue` and send it with `FormData`. In `client.ts`, don't force the JSON `Content-Type` for a file.

One trap: `main.ts` doesn't enable `ValidationPipe`, so the DTO rules aren't enforced yet. We'll turn it on in Phase 3.

Start with Phase 1 and tell me exactly where it gets stuck. After that, I'll give you the code for Phase 3, one small piece at a time.
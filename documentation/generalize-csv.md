Good approach. Here is the plan. Your `member.service.ts` → `importCsv` is your model, so generalize it. I give you the tools and hints, but not the code.

**Step 1: Module**
- Create `src/import/` with `import.module.ts`, `import.controller.ts` and `import.service.ts`.
- Register `ImportModule` in `app.module.ts`.

**Step 2: Route**
- `@Controller('import')` and `@Post(':resource')`. Read the name with `@Param('resource')`.
- Copy the file-upload part from `member.controller.ts`.
- Test first with only `console.log(resource, file.originalname)` before writing any logic.

**Step 3: Find the table from the name**
- Inject `DataSource` (from `typeorm`) in the service constructor.
- `branch` is the name in the URL, but a name like `territory-level` must become `territory_level`. Use `replace`.
- `this.dataSource.entityMetadatas` lists all your entities. Find the one where `tableName` matches, otherwise throw `NotFoundException`.
- Get its repository with `this.dataSource.getRepository(meta.target)`.

**Step 4: Which columns are allowed**
- `meta.columns` describes every column. Explore with `console.log(meta.columns.map(c => [c.propertyName, c.type, c.isNullable]))`.
- Ignore the generated `id` and the date columns. Look at the properties `isGenerated`, `isCreateDate` and `isUpdateDate`.
- For this first version, also ignore columns that have a `relationMetadata` (the foreign keys). We handle them later.
- If the CSV header contains an unknown column, throw `BadRequestException` listing the accepted columns.

**Step 5: Convert each value by its type**
- Write a small `convert(column, rawText)` function that uses `column.type`: `'int'`, `'boolean'`, `'date'`, `'decimal'`, `'varchar'`.
- Empty text becomes `null`, but only if `column.isNullable` is true. Otherwise it is an error.
- Return an error message for a bad value (for example "abc" in an int column).

**Step 6: Save**
- Same loop as in `member.service.ts`: valid rows go in a list, errors go in `{ line, message }`, then `repo.save(repo.create(valid))`.
- Return `{ imported, errors }`.

**Step 7: Test with `curl`** on your two files:
```bash
curl -X POST http://localhost:3000/import/territory-level -H "Authorization: Bearer $TOKEN" -F "file=@territory_level.csv"
curl -X POST http://localhost:3000/import/branch -H "Authorization: Bearer $TOKEN" -F "file=@branch.csv"
```

**Check:** also try a bad file (a letter in `level`) and a file with an unknown column.

When you're stuck, paste your code and the exact error, and I'll give a hint instead of the answer. When it works, send me your service for a review, and then we do the front end.
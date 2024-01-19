# Ultra lightweight `q`uery `man`ager

- super small bundle size 📦
- manages deterministic query keys and invocations 🛠️
- enhances type safety of existing fetching packages 🧪
- organizes fetching structure into schemas 🫐
- fully tree shake-able 🌴

##  Usage
```ts
import { query, schema } from 'qman'
import { use } from 'qman/swr' // or qman/query

// Specifies your getters, can be api route, db handlers, anything that returns a promise
const getAllUsers = () => fetch('your.api/users/')
const getUserById = (id: string) => fetch(`your.api/users/${id}`)

// Specifies a schema that organizes your api, declare multiple schemas based on category
export const users = schema(
  'users',
  query('allUsers', getAllUsers, use), 
  query('byId', getUserById, use)
)

// Later in code (usually in different file) use your schema.
users.get('allUsers', [])
users.get('byId', ['exampleId123']) // You get full type-safety here with exact argument names i.e. `[id: string]`
```

This also ensures your query keys are always unique even if different schemas have same queries.
i.e. you can have a schema called `users` and `posts` which both ship `byId` query. You can be sure and safe that even if you mutate / revalidate, it will stay within the schema boundaries and will get type safety according to schema definitions.



## Advanced usage
Adds support for advanced query usage, such as
- firebase
- subscriptions
- mutations

> documentation with beta release that will expand on these topics

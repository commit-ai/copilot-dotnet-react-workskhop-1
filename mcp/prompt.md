Create a TypeScript MCP (Model Context Protocol) server in `src/index.ts` for this repository's superhero workshop.

Repository-specific adaptation notes:

- This repo already keeps the workshop data in `backend/data/superheroes.json`
- The MCP package should reuse that backend data instead of maintaining its own copy
- The server should run over stdio and expose superhero lookup/comparison tools

Required tools:

1. `get_superhero`
   - Accept optional `name` and optional `id`
   - Match names case-insensitively
   - Return formatted markdown for the matching hero

2. `list-superheroes`
   - Return the loaded heroes as markdown bullet points in `ID: {id} - {name}` format

3. `compare-superheroes`
   - Accept required `hero1_id` and `hero2_id`
   - Compare all six powerstats
   - Return markdown showing each category winner plus the overall winner by total stats

Validation:

1. Run `npm run build` inside `/mcp`
2. Run `npm test` inside `/mcp`

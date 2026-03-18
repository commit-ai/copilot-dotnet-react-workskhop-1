#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

interface Powerstats {
  intelligence: number;
  strength: number;
  speed: number;
  durability: number;
  power: number;
  combat: number;
}

interface Superhero {
  id: string | number;
  name: string;
  image: string;
  powerstats: Powerstats;
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.join(__dirname, '../../backend/data/superheroes.json');
const server = new McpServer({
  name: 'superheroes-mcp',
  version: '1.0.0',
});

async function loadSuperheroes(): Promise<Superhero[]> {
  try {
    const data = await fs.promises.readFile(dataPath, 'utf-8');
    return JSON.parse(data) as Superhero[];
  } catch (err) {
    throw new Error(`Failed to load superheroes data: ${err instanceof Error ? err.message : String(err)}`);
  }
}

function formatSuperheroMarkdown(hero: Superhero): string {
  return `Here is the data for ${hero.name} retrieved using the superheroes MCP:

• Name: ${hero.name}
• Image: <img src="${hero.image}" alt="${hero.name}"/>
• Powerstats:
  • Intelligence: ${hero.powerstats.intelligence}
  • Strength: ${hero.powerstats.strength}
  • Speed: ${hero.powerstats.speed}
  • Durability: ${hero.powerstats.durability}
  • Power: ${hero.powerstats.power}
  • Combat: ${hero.powerstats.combat}`;
}

server.tool(
  'get_superhero',
  'Get superhero details by name or id',
  {
    name: z.string().optional().describe('Name of the superhero (optional)'),
    id: z.string().optional().describe('ID of the superhero (optional)'),
  },
  async ({ name, id }: { name?: string; id?: string }) => {
    const superheroes = await loadSuperheroes();
    const nameLc = name?.toLowerCase() ?? '';
    const idStr = id?.toString() ?? '';

    const superhero = superheroes.find((hero) => {
      const heroNameLc = hero.name?.toLowerCase() ?? '';
      const heroIdStr = hero.id?.toString() ?? '';

      return (nameLc && heroNameLc === nameLc) || (idStr && heroIdStr === idStr);
    });

    if (!superhero) {
      throw new Error('Superhero not found');
    }

    return {
      content: [
        {
          type: 'text' as const,
          text: formatSuperheroMarkdown(superhero),
        },
      ],
    };
  }
);

// TODO: implement additional MCP tools using GitHub Copilot and the prompt in ../prompt.md

async function main(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Superhero MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error in main():', error);
  process.exit(1);
});

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

function calculateTotalStats(hero: Superhero): number {
  return hero.powerstats.intelligence
    + hero.powerstats.strength
    + hero.powerstats.speed
    + hero.powerstats.durability
    + hero.powerstats.power
    + hero.powerstats.combat;
}

server.registerTool(
  'get_superhero',
  {
    description: 'Get superhero details by name or id',
    inputSchema: {
      name: z.string().optional().describe('Name of the superhero (optional)'),
      id: z.string().optional().describe('ID of the superhero (optional)'),
    },
  },
  async ({ name, id }) => {
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

server.registerTool(
  'list-superheroes',
  {
    description: 'Get a list of all superheroes with their IDs and names',
    inputSchema: {},
  },
  async () => {
    const superheroes = await loadSuperheroes();
    const text = superheroes
      .map((hero) => `- ID: ${hero.id} - ${hero.name}`)
      .join('\n');

    return {
      content: [
        {
          type: 'text' as const,
          text,
        },
      ],
    };
  }
);

server.registerTool(
  'compare-superheroes',
  {
    description: 'Compare two superheroes across all six powerstat dimensions',
    inputSchema: {
      hero1_id: z.string().describe('ID of the first superhero (required)'),
      hero2_id: z.string().describe('ID of the second superhero (required)'),
    },
  },
  async ({ hero1_id, hero2_id }) => {
    const superheroes = await loadSuperheroes();
    const hero1 = superheroes.find((hero) => hero.id?.toString() === hero1_id);
    const hero2 = superheroes.find((hero) => hero.id?.toString() === hero2_id);

    if (!hero1 || !hero2) {
      throw new Error('Superhero not found');
    }

    const stats: Array<keyof Powerstats> = ['intelligence', 'strength', 'speed', 'durability', 'power', 'combat'];
    const comparisonLines = stats.map((stat) => {
      const hero1Value = hero1.powerstats[stat];
      const hero2Value = hero2.powerstats[stat];
      const winnerName = hero1Value === hero2Value ? 'Tie' : hero1Value > hero2Value ? hero1.name : hero2.name;

      return `- ${stat}: ${hero1.name} (${hero1Value}) vs ${hero2.name} (${hero2Value}) - Winner: ${winnerName}`;
    });

    const hero1Total = calculateTotalStats(hero1);
    const hero2Total = calculateTotalStats(hero2);
    const overallWinner = hero1Total === hero2Total ? 'Tie' : hero1Total > hero2Total ? hero1.name : hero2.name;
    const overallWinnerTotal = hero1Total === hero2Total ? hero1Total : Math.max(hero1Total, hero2Total);

    return {
      content: [
        {
          type: 'text' as const,
          text: [
            `# ${hero1.name} vs ${hero2.name}`,
            ...comparisonLines,
            '',
            `Overall winner: ${overallWinner} (${overallWinnerTotal} total stats)`,
          ].join('\n'),
        },
      ],
    };
  }
);

async function main(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Superhero MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error in main():', error);
  process.exit(1);
});

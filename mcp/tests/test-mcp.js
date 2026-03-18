#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function loadSuperheroes() {
  try {
    const data = await fs.promises.readFile(
      path.join(__dirname, '../../backend/data/superheroes.json'),
      'utf-8'
    );

    return JSON.parse(data);
  } catch (err) {
    throw new Error(`Failed to load superheroes data: ${err instanceof Error ? err.message : String(err)}`);
  }
}

function formatSuperheroMarkdown(hero) {
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

async function testMCP() {
  console.log('Testing MCP server functionality...');

  try {
    const superheroes = await loadSuperheroes();
    console.log(`✅ Successfully loaded ${superheroes.length} superheroes`);

    const batman = superheroes.find((hero) => hero.name?.toLowerCase() === 'batman');
    if (batman) {
      console.log('✅ Found Batman by name');
      console.log(formatSuperheroMarkdown(batman));
    } else {
      console.log('❌ Could not find Batman');
    }

    const hero1 = superheroes.find((hero) => hero.id?.toString() === '1');
    if (hero1) {
      console.log(`✅ Found hero by ID 1: ${hero1.name}`);
    } else {
      console.log('❌ Could not find hero with ID 1');
    }
  } catch (error) {
    console.error('❌ Test failed:', error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}

testMCP();

import 'dotenv/config';
import {
  Client,
  EmbedBuilder,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder
} from 'discord.js';
import { createClient } from '@supabase/supabase-js';

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const API_BASE = process.env.VITE_API_BASE || 'http://localhost:5173';
const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const DISCORD_GUILD_ID = process.env.DISCORD_GUILD_ID;

if (!DISCORD_TOKEN) {
  throw new Error('Missing DISCORD_TOKEN');
}

const supabase =
  SUPABASE_URL && SUPABASE_SERVICE_KEY
    ? createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
    : null;

const commands = [
  new SlashCommandBuilder()
    .setName('postproject')
    .setDescription('Post a Synapse Beats project embed')
    .addStringOption((option) =>
      option.setName('url').setDescription('Project URL like https://your.site/projects/:id').setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName('preview')
    .setDescription('Preview a public project by id')
    .addStringOption((option) => option.setName('id').setDescription('Project id').setRequired(true))
].map((command) => command.toJSON());

async function registerCommands() {
  if (!DISCORD_CLIENT_ID) {
    console.log('Skipping slash command registration (missing DISCORD_CLIENT_ID).');
    return;
  }

  const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);

  if (DISCORD_GUILD_ID) {
    // quick local dev mode bc guild commands show up fast
    await rest.put(Routes.applicationGuildCommands(DISCORD_CLIENT_ID, DISCORD_GUILD_ID), {
      body: commands
    });
    console.log('Registered guild slash commands.');
    return;
  }

  await rest.put(Routes.applicationCommands(DISCORD_CLIENT_ID), { body: commands });
  console.log('Registered global slash commands.');
}

async function fetchProjectById(id) {
  if (supabase) {
    const { data } = await supabase
      .from('projects')
      .select('id,title,description,owner_id,data,is_public')
      .eq('id', id)
      .eq('is_public', true)
      .maybeSingle();
    if (data) return data;
  }

  const response = await fetch(`${API_BASE}/api/projects/${id}`);
  if (!response.ok) return null;
  return response.json();
}

function extractProjectId(inputUrl) {
  try {
    const parsed = new URL(inputUrl);
    const parts = parsed.pathname.split('/').filter(Boolean);
    const idx = parts.findIndex((part) => part === 'projects');
    return idx >= 0 ? parts[idx + 1] : null;
  } catch {
    return null;
  }
}

function buildEmbed(project, link) {
  return new EmbedBuilder()
    .setTitle(project.title || 'Untitled beat')
    .setDescription(project.description || 'No description yet.')
    .addFields(
      { name: 'Owner', value: project.owner_id || 'unknown', inline: true },
      { name: 'BPM', value: String(project.data?.bpm ?? 'n/a'), inline: true }
    )
    .setURL(link)
    .setColor(0x7c3aed)
    .setTimestamp(new Date());
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', async () => {
  console.log(`Bot online as ${client.user.tag}`);
  console.log('Env check: SUPABASE_SERVICE_KEY is', SUPABASE_SERVICE_KEY ? 'set' : 'not set');
  console.log('Tip: keep service key server-side only, never in frontend.');

  try {
    await registerCommands();
  } catch (error) {
    console.error('Slash command registration failed:', error.message);
  }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'postproject') {
    const projectUrl = interaction.options.getString('url', true);
    const id = extractProjectId(projectUrl);
    if (!id) {
      await interaction.reply({ content: 'Could not parse project id from that URL.', ephemeral: true });
      return;
    }

    const project = await fetchProjectById(id);
    if (!project) {
      await interaction.reply({ content: 'Project not found (or not public).', ephemeral: true });
      return;
    }

    const embed = buildEmbed(project, projectUrl);
    await interaction.reply({ embeds: [embed] });
    return;
  }

  if (interaction.commandName === 'preview') {
    const id = interaction.options.getString('id', true);
    const project = await fetchProjectById(id);
    if (!project) {
      await interaction.reply({ content: 'Project not found (or not public).', ephemeral: true });
      return;
    }

    const link = `${API_BASE.replace(/\/$/, '')}/projects/${id}`;
    const embed = buildEmbed(project, link).setFooter({ text: 'Preview mode' });
    await interaction.reply({ embeds: [embed] });
  }
});

// ▫️ run: DISCORD_TOKEN=... DISCORD_CLIENT_ID=... node bot/index.js
client.login(DISCORD_TOKEN);

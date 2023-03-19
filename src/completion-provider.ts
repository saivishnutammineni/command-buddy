export function getSuggestedCommands(prompt: string): string[] {
  return Math.random() > 0.5 ? ['git pull', 'git clone', 'git checkout'] : ['npx nx run serve'];
}

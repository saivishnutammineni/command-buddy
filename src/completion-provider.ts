import { getSavedCommands } from './command.store';

export function getSuggestedCommands(prompt: string): string[] {
  const savedCommands = getSavedCommands();

  return savedCommands?.filter((savedCommand) => savedCommand.startsWith(prompt));
}

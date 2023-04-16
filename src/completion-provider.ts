import { getSavedCommands } from './command.store';

export function getSuggestedCommands(prompt: string): string[] {
  const savedCommands = getSavedCommands();

  /**
   * Suggestion logic:
   * Suggest commands that start with the prompt
   * Suggest commands that contain the prompt
   * Sorting is in the ascending order of the latest last usage (happens automatically as while storing the commands, we store the
   * latest command at the start of the array )
   */

  const startingWithPromptSuggestions = savedCommands
    ?.filter((savedCommand) => savedCommand?.command?.startsWith(prompt))
    ?.map((savedCommand) => savedCommand.command);

  const containsPromptSuggestions = savedCommands
    ?.filter((savedCommand) => savedCommand?.command?.includes(prompt))
    ?.map((savedCommand) => savedCommand.command);

  const suggestedCommands = new Set([...startingWithPromptSuggestions, ...containsPromptSuggestions]);
  return new Array(...suggestedCommands);
}

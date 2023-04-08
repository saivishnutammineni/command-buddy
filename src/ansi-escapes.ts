const ESC = '\u001B[';

export const AnsiEscapes = {
  LEFT: ESC + '1D',
  LEFT_START: ESC + 'G',
  DOWN: ESC + '1B',
  SAVE_POS: ESC + 's',
  RESTORE_POS: ESC + 'u',
  /**
   * Erases from current cursor position to end of screen
   */
  ERASE_TO_END: ESC + '0J',
  ERASE_CURRENT_LINE: ESC + '2K',
  CLEAR_TERMINAL: ESC + '2J',
};

export const KeyCodes = {
  ENTER: '\r',
  BACKSPACE: '\x7f',
  // CTRL + C
  TERMINATE: '\u0003',
  DOWN_ARROW: ESC + `B`,
  UP_ARROW: ESC + 'A',
  RIGHT_ARROW: ESC + 'C',
  LEFT_ARROW: ESC + 'D',
  TAB: '\t',
};

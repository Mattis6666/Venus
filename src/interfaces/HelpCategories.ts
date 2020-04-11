import { CommandCategories } from './CommandTypes';

export type HelpCategories = {
    [key in CommandCategories]: string;
};

export type HelpCommands = {
    [key in CommandCategories]: string[];
};

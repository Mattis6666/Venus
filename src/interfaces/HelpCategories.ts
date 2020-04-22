import { VenusCommandCategories } from './Client';

export type HelpCategories = {
    [key in VenusCommandCategories]: string;
};

export type HelpCommands = {
    [key in VenusCommandCategories]: string[];
};

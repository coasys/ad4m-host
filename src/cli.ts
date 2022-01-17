#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import {
  command as greetCommand, desc as greetDesc,
  builder as greetBuilder, handler as greetHandler,
} from './commands/greet'
import {
  command as serveCommand, desc as serveDesc,
  builder as serveBuilder, handler as serveHandler,
} from './commands/serve'
import {
  command as initCommand, desc as initDesc,
  builder as initBuilder, handler as initHandler,
} from './commands/init'

yargs(hideBin(process.argv))
  .command(greetCommand, greetDesc, greetBuilder, greetHandler)
  .command(serveCommand, serveDesc, serveBuilder, serveHandler)
  .command(initCommand, initDesc, initBuilder, initHandler)
  // Enable strict mode.
  .strict()
  // Useful aliases.
  .alias({ h: 'help' })
  .argv;

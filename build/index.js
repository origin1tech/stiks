const stiks = require('../dist');
const sym = require('log-symbols');
const log = stiks.log;
const colurs = stiks.colurs.get();
const pkg = stiks.pkg();
const build = pkg && pkg.build;

// Ensure build info.
if (!build)
  log.error('Whoops looks like you forgot to configure package.json "build".');

// Parse command line arguments.
const parsed = stiks.argv.parse();
const command = parsed.command;
const commands = parsed.commands;
const flags = parsed.flags;

// Get user input less the command.
const input = parsed.normalized.slice(1);

let args;

// Merges default args with any input args.
function normalize(def) {
  return stiks.argv.mergeArgs(def, input);
}

// Build actions.
const actions = {

  clean: () => {
    stiks.clean(build.clean);
    log(sym.success, 'Finished clean.');
    return actions;
  },

  copy: () => {
    stiks.copyAll(build.copy);
    log(sym.success, 'Finished copy.');
    return actions;
  },

  compile: (watch) => {
    args = './node_modules/typescript/bin/tsc -p ./src/tsconfig.json'
    args += (watch ? ' -w' : '');
    args = normalize(args);
    stiks.exec.node(args);
    log(sym.success, 'Finished compile.');
    return actions;
  },

  watch: () => {
    actions.compile(true);
    log('\n' + sym.info, 'Watching for changes.\n');
    return actions;
  },

  docs: () => {
    args = './node_modules/typedoc/bin/typedoc --out ./docs ./src --options ./typedoc.json';
    args = normalize(args);
    stiks.exec.node(args);
    log(sym.success, 'Finished docs.');
    return actions;
  },

  bump: () => {
    const type = flags.semver || 'patch';
    const result = stiks.bump(type);
    log(sym.success, `Finished bump from ${result.previous} to ${result.current}.`);
    return actions;
  },

  build: () => {
    actions.clean()
      .copy()
      .compile();
    log('\n' + sym.success, 'Finished build group.\n');
    return actions;
  },

  commit: () => {
    args = `commit -a -m 'auto commit'`;
    args = normalize(args);
    stiks.exec.command('git', 'add .');
    stiks.exec.command('git', args);
    stiks.exec.command('git', 'push');
    log(sym.success, 'Finished commit.');
    return actions;
  },

  publish() {
    stiks.exec.npm('publish');
    log(sym.success, 'Finished publish.');
    return actions;
  },

  release: () => {
    actions.build()
      .docs()
      .bump()
      .commit()
      .publish();
    log('\n' + sym.success, 'Finished release group.\n');
    return actions;
  },

  test: () => {
    args = '--opts ./src/mocha.opts';
    args = normalize(args);
    stiks.exec.command('mocha', args);
  },

  serve: () => {
    const opts = flags || {};
    const server = stiks.serve('dev-server', opts, true);
  },

  exit: (msg, code) => {
    if (msg)
      log(msg)
    process.exit(code || 0);
  }

};

if (!actions[command])
  log.error(`Failed to run command "${command}", the command does not exist.`);

// Start the chain.
actions[command]();
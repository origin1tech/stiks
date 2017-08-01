const stiks = require('../dist');
const log = stiks.log;
const parsed = stiks.argv.parse();
const colurs = stiks.colurs.get();
const chek = stiks.chek;
const npm = stiks.npm;
const pkg = stiks.pkg();
const build = pkg && pkg.build;
const changeTimer = 500;

// Just add some space.
log.write();

// Ensure build info.
if (!build)
  log.error('whoops looks like you forgot to configure package.json "build".').exit();

// Swtich on cmd exec requested action.
switch (parsed.cmd) {

  case 'clean':
    stiks.clean(build.clean);
    break;

  case 'test':
    const str =
      stiks.stringBuilder().add('Bob Jones', 'bgRed.white').add('is my name.').render();
    console.log(str);

    break;

  case 'bump':
    stiks.bump();
    break;

  default:
    log.write(colurs.bgRed.white(` Whoops command "${parsed.cmd}" was not found`))
      .write()
      .exit();


}
const fs = require('node:fs');
const assert = require('node:assert/strict');
const {expo} = JSON.parse(fs.readFileSync('app.json','utf8'));
assert.equal(expo.android.package, 'com.example.goexpoclouddemo');
assert.equal(expo.ios.bundleIdentifier, expo.android.package);
for(const file of ['maestro/booking.yaml','maestro/night-limits.yaml']) {
  assert.ok(fs.readFileSync(file,'utf8').startsWith(`appId: ${expo.android.package}\n`));
}
assert.ok(fs.existsSync('package-lock.json'), 'Commit package-lock.json for npm ci');
console.log('App IDs, Maestro flow targets and dependency lock verified');

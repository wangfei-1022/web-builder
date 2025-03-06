const execSync = require('child_process').execSync

module.exports = {
  getVersion: () => {
    let commit = execSync('git rev-parse --short HEAD').toString().trim()
    return commit
  }
}

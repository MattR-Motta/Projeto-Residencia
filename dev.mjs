import { spawn } from 'node:child_process'

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm'
const processos = [
  spawn(process.execPath, ['server.mjs'], { stdio: 'inherit' }),
  spawn(npm, ['run', 'dev'], { stdio: 'inherit', shell: process.platform === 'win32' }),
]

function encerrar() {
  processos.forEach((processo) => processo.kill())
}
process.on('SIGINT', encerrar)
process.on('SIGTERM', encerrar)
processos.forEach((processo) => processo.on('exit', (codigo) => {
  if (codigo && codigo !== 0) encerrar()
}))

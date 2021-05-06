#!/usr/bin/env node

// 添加工作目录参数
process.argv.push('--cwd');
process.argv.push(process.cwd());

// 添加gulpfile参数
process.argv.push('--gulpfile');
process.argv.push(require.resolve('..'));

// 执行 gulpcli 命令
require('gulp/bin/gulp');

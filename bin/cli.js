#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { interactiveMode, runInstall, runUpdate, runUninstall } from '../src/index.js';
import { getPackageVersion, COMPONENTS } from '../src/utils.js';

const program = new Command();

program
  .name('aimax')
  .description('AI MAX - Claude Code 能力增强，开箱即用')
  .version(getPackageVersion());

// 默认命令 - 交互模式
program
  .action(async () => {
    try {
      await interactiveMode();
    } catch (error) {
      console.error(chalk.red('错误：'), error.message);
      process.exit(1);
    }
  });

// 安装命令
program
  .command('install')
  .description('安装 AI MAX')
  .option('-y, --yes', '跳过确认提示')
  .option('-f, --force', '强制覆盖现有文件（不备份）')
  .action(async (options) => {
    try {
      await runInstall({
        yes: options.yes,
        force: options.force,
        quiet: false
      });
    } catch (error) {
      console.error(chalk.red('错误：'), error.message);
      process.exit(1);
    }
  });

// 更新命令
program
  .command('update')
  .description('更新 AI MAX')
  .option('-y, --yes', '跳过确认提示')
  .action(async (options) => {
    try {
      await runUpdate({ yes: options.yes });
    } catch (error) {
      console.error(chalk.red('错误：'), error.message);
      process.exit(1);
    }
  });

// 卸载命令
program
  .command('uninstall')
  .description('卸载 AI MAX')
  .option('-y, --yes', '跳过确认提示')
  .action(async (options) => {
    try {
      await runUninstall({ yes: options.yes });
    } catch (error) {
      console.error(chalk.red('错误：'), error.message);
      process.exit(1);
    }
  });

// 列表命令
program
  .command('list')
  .description('列出可用组件')
  .action(() => {
    console.log('');
    console.log(chalk.cyan.bold('可用组件：'));
    console.log('');
    for (const [key, value] of Object.entries(COMPONENTS)) {
      console.log(`  ${chalk.green(value.name.padEnd(16))} ${value.description}`);
    }
    console.log('');
  });

// 文档命令
program
  .command('docs')
  .description('打开使用文档')
  .action(async () => {
    const url = 'https://github.com/zhukunpenglinyutong/ai-max';
    console.log('');
    console.log(chalk.cyan('正在打开文档...'));
    console.log(chalk.gray(`  ${url}`));
    console.log('');

    // 跨平台打开浏览器
    const { exec } = await import('child_process');
    const platform = process.platform;
    let command;

    if (platform === 'darwin') {
      command = `open "${url}"`;
    } else if (platform === 'win32') {
      command = `start "" "${url}"`;
    } else {
      command = `xdg-open "${url}"`;
    }

    exec(command, (error) => {
      if (error) {
        console.log(chalk.yellow('无法自动打开浏览器，请手动访问上述链接。'));
      }
    });
  });

program.parse();

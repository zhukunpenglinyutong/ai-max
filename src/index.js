import chalk from 'chalk';
import { install, uninstall } from './installer.js';
import {
  showBanner,
  promptConfirmation,
  promptUninstallConfirmation,
  promptMainMenu
} from './prompts.js';
import { getInstalledVersion, COMPONENTS } from './utils.js';

/**
 * 交互模式 - 主菜单
 */
export async function interactiveMode() {
  showBanner();

  const action = await promptMainMenu();

  switch (action) {
    case 'install':
      await runInstall();
      break;
    case 'update':
      await runUpdate();
      break;
    case 'uninstall':
      await runUninstall();
      break;
    case 'docs':
      await runDocs();
      break;
    case 'exit':
      console.log(chalk.gray('再见！'));
      break;
  }
}

/**
 * 运行安装命令
 */
export async function runInstall(options = {}) {
  if (!options.quiet) {
    showBanner();
  }

  // 始终安装所有组件
  const selectedComponents = Object.keys(COMPONENTS);

  console.log('');
  console.log(chalk.cyan('将要安装 AI MAX 的所有组件：'));
  for (const key of selectedComponents) {
    console.log(chalk.gray(`  • ${COMPONENTS[key].name}`));
  }
  console.log('');

  if (!options.yes) {
    const confirmed = await promptConfirmation('确认安装 AI MAX？');
    if (!confirmed) {
      console.log(chalk.yellow('安装已取消。'));
      return;
    }
  }

  console.log('');
  await install(selectedComponents, { force: options.force });

  console.log('');
  console.log(chalk.cyan('后续步骤：'));
  console.log(chalk.gray('  1. 重启 Claude Code 以加载新配置'));
  console.log(chalk.gray('  2. 使用 /aimax:plan, /aimax:tdd, /aimax:code-review 等命令'));
  console.log(chalk.gray('  3. 阅读指南：https://x.com/affaanmustafa/status/2012378465664745795'));
  console.log('');
}

/**
 * 运行更新命令
 */
export async function runUpdate(options = {}) {
  const installedVersion = await getInstalledVersion();

  if (!installedVersion) {
    console.log(chalk.yellow('未找到安装记录，请先运行安装命令。'));
    return;
  }

  console.log(chalk.cyan(`正在从版本 ${installedVersion.version} 更新...`));
  console.log('');

  const selectedComponents = installedVersion.components || Object.keys(COMPONENTS);

  if (!options.yes) {
    const confirmed = await promptConfirmation('确认更新 AI MAX？');
    if (!confirmed) {
      console.log(chalk.yellow('更新已取消。'));
      return;
    }
  }

  await install(selectedComponents, { force: true });
}

/**
 * 运行卸载命令
 */
export async function runUninstall(options = {}) {
  const installedVersion = await getInstalledVersion();

  if (!installedVersion) {
    console.log(chalk.yellow('未找到安装记录。'));
    return;
  }

  if (!options.yes) {
    const confirmed = await promptUninstallConfirmation();
    if (!confirmed) {
      console.log(chalk.yellow('卸载已取消。'));
      return;
    }
  }

  const components = installedVersion.components || Object.keys(COMPONENTS);
  await uninstall(components);
}

/**
 * 打开使用文档
 */
export async function runDocs() {
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
}

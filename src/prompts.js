import inquirer from 'inquirer';
import chalk from 'chalk';
import { COMPONENTS, getClaudeDir, getInstalledVersion, getPackageVersion } from './utils.js';

/**
 * 显示欢迎横幅
 */
export function showBanner() {
  const version = getPackageVersion();
  console.log('');
  console.log(chalk.cyan.bold('  ╔═══════════════════════════════════════════╗'));
  console.log(chalk.cyan.bold('  ║                                           ║'));
  console.log(chalk.cyan.bold('  ║') + chalk.white.bold(`           AI MAX（v${version}）                 `) + chalk.cyan.bold('║'));
  console.log(chalk.cyan.bold('  ║') + chalk.gray('     Claude Code 能力增强，开箱即用      ') + chalk.cyan.bold('║'));
  console.log(chalk.cyan.bold('  ║                                           ║'));
  console.log(chalk.cyan.bold('  ╚═══════════════════════════════════════════╝'));
  console.log('');
  console.log(chalk.gray(`  目标目录：${getClaudeDir()}`));
  console.log('');
}

/**
 * 提示选择组件
 */
export async function promptComponentSelection() {
  const choices = Object.entries(COMPONENTS).map(([key, value]) => ({
    name: `${value.name} - ${chalk.gray(value.description)}`,
    value: key,
    checked: true
  }));

  const { components } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'components',
      message: '选择要安装的组件：',
      choices,
      validate: (answer) => {
        if (answer.length === 0) {
          return '请至少选择一个组件。';
        }
        return true;
      }
    }
  ]);

  return components;
}

/**
 * 提示确认
 */
export async function promptConfirmation(message = '确认继续安装？') {
  const { confirmed } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirmed',
      message,
      default: true
    }
  ]);

  return confirmed;
}

/**
 * 提示卸载确认
 */
export async function promptUninstallConfirmation() {
  const { confirmed } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirmed',
      message: chalk.yellow('确定要卸载 AI MAX 吗？'),
      default: false
    }
  ]);

  return confirmed;
}

/**
 * 提示选择操作（主菜单）
 */
export async function promptMainMenu() {
  const installedVersion = await getInstalledVersion();

  const choices = [
    { name: '安装 AI MAX', value: 'install' },
    { name: '更新 AI MAX', value: 'update', disabled: !installedVersion ? '（未安装）' : false },
    { name: '卸载 AI MAX', value: 'uninstall', disabled: !installedVersion ? '（未安装）' : false },
    new inquirer.Separator(),
    { name: '查看文档', value: 'docs' },
    { name: '退出', value: 'exit' }
  ];

  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: '请选择操作：',
      choices
    }
  ]);

  return action;
}

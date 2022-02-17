import { Telegram } from './client/Telegram';
import { config } from './providers/userConfig';
import { getLogger, configure } from 'log4js';
import SetupController from './controllers/SetupController';

(async () => {
  configure({
    appenders: {
      console: { type: 'console' },
    },
    categories: {
      default: { level: 'debug', appenders: ['console'] },
    },
  });
  const log = getLogger('Main');
  log.debug('正在登录 TG Bot');
  const tgBot = await Telegram.create({
    botAuthToken: process.env.TG_BOT_TOKEN,
  });
  let tgUser: Telegram;
  log.debug('TG Bot 登录完成');
  if (!config.isSetup) {
    log.info('当前服务器未配置，请向 Bot 发送 /setup 来设置');
    const setupController = new SetupController(tgBot);
    ({ tgUser } = await setupController.waitForFinish());
  }
  else {
    tgUser = await Telegram.connect(config.userBotSession);
  }
})();

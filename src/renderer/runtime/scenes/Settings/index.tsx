import { useEffect, useState } from 'react';

import { version } from '../../../../../package.json';
import { SettingsFormat } from '../../../../common/types';
import logo from '../../assets/images/logo.png';
import If from '../../components/If';
import { MemoryRange } from '../../components/MemoryRange';
import { useTitlebar } from '../../components/TitleBar/hooks';
import classes from './index.module.sass';

export default function Settings() {
    const {
        showTitlebarBackBtn,
        setTitlebarTitleText,
        hideTitlebarSettingsBtn,
        hideTitlebarLogoutBtn,
    } = useTitlebar();

    useEffect(() => {
        hideTitlebarLogoutBtn();
        showTitlebarBackBtn();
        hideTitlebarSettingsBtn();
        setTitlebarTitleText('Настройки лаунчера');

        launcherAPI.scenes.settings
            .getAllFields()
            .then((res) => {
                setSettings(res);
            });
        launcherAPI.scenes.settings
            .getTotalMemory()
            .then((res) => SetTotalMemory(res));
    }, []);

    const [main, EditButtonMain] = useState(true);
    const [info, EditButtonInfo] = useState(false);

    const [totalMemory, SetTotalMemory] = useState(0);
    const [settings, setSettings] = useState<SettingsFormat>({});

    const setValue = (field: string, value: any) => {
        setSettings({
            ...settings,
            [field]: value,
        });
        launcherAPI.scenes.settings.setField(field, value);
    };

    const Button = (type: string) => {
        switch (type) {
            case 'main':
                EditButtonMain(true);
                EditButtonInfo(false);
                return;
            case 'info':
                EditButtonMain(false);
                EditButtonInfo(true);
                return;
        }
    };

    return (
        <div className={classes.window}>
            <div className={classes.buttonsList}>
                <div className={classes.buttons}>
                    <button onClick={() => Button('main')} disabled={main}>
                        Основное
                    </button>
                    <button onClick={() => Button('info')} disabled={info}>
                        О лаунчере
                    </button>
                </div>
            </div>
            <If state={main}>
                <div className={classes.options}>
                    <label className={classes.checkbox}>
                        <input
                            type="checkbox"
                            checked={settings.fullScreen}
                            onChange={(e) =>
                                setValue(
                                    'fullScreen',
                                    Boolean(e.target.checked),
                                )
                            }
                        />
                        <span className={classes.checkboxSwitch}></span>
                        Запуск игры во весь экран
                    </label>
                    <label className={classes.checkbox}>
                        <input
                            type="checkbox"
                            checked={settings.startDebug}
                            onChange={(e) =>
                                setValue(
                                    'startDebug',
                                    Boolean(e.target.checked),
                                )
                            }
                        />
                        <span className={classes.checkboxSwitch}></span>
                        Запуск игры в дебаг режиме
                    </label>
                    <label className={classes.checkbox}>
                        <input
                            type="checkbox"
                            checked={settings.autoConnect}
                            onChange={(e) =>
                                setValue('autoConnect', Boolean(e.target.checked))
                            }
                        />
                        <span className={classes.checkboxSwitch}></span>
                        Автоматический вход на сервер
                    </label>
                    <label>
                        Выделено оперативной памяти: {settings.memory}MB
                    </label>
                    <br />
                    <MemoryRange
                        limit={totalMemory}
                        onChange={(e) =>
                            setValue('memory', Number(e.target.value))
                        }
                        value={settings.memory}
                    />
                    <label>
                    Расположение игры
                    </label>
                    <br />
                    <div className={classes.changeDir}>
                        <button className={classes.openDir} onClick={() => launcherAPI.window.openDir(settings.dir)}>
                        {settings.dir}
                        </button>
                        <button className={classes.editDir} onClick={() => {
                            launcherAPI.window.editDir();
                            launcherAPI.scenes.settings
                            .getAllFields()
                            .then((res) => {
                                setSettings(res);
                            });
                        }}>
                            Смена директории
                        </button>
                    </div>
                </div>
            </If>
            <If state={info}>
                <div className={classes.options}>
                    <div className={classes.logo}>
                        <img src={logo} alt="TreeMine Launcher" />
                    </div>
                    <div className={classes.launcherName}>
                        <center>
                            <h1>TreeMine Launcher</h1>
                        </center>
                    </div>
                    <div className={classes.icons}>
                        <button
                            onClick={() =>
                                launcherAPI.window.openExternal(
                                    'https://discord.gg/AND4bFZSRY',
                                )
                            }
                        >
                            <svg width="35" height="35" viewBox="0 0 24 24">
                                <path
                                    d="M18.8943 4.34399C17.5183 3.71467 16.057 3.256 14.5317 3C14.3396 3.33067 14.1263 3.77866 13.977 4.13067C12.3546 3.89599 10.7439 3.89599 9.14391 4.13067C8.99457 3.77866 8.77056 3.33067 8.58922 3C7.05325 3.256 5.59191 3.71467 4.22552 4.34399C1.46286 8.41865 0.716188 12.3973 1.08952 16.3226C2.92418 17.6559 4.69486 18.4666 6.4346 19C6.86126 18.424 7.24527 17.8053 7.57594 17.1546C6.9466 16.92 6.34927 16.632 5.77327 16.2906C5.9226 16.184 6.07194 16.0667 6.21061 15.9493C9.68793 17.5387 13.4543 17.5387 16.889 15.9493C17.0383 16.0667 17.177 16.184 17.3263 16.2906C16.7503 16.632 16.153 16.92 15.5236 17.1546C15.8543 17.8053 16.2383 18.424 16.665 19C18.4036 18.4666 20.185 17.6559 22.01 16.3226C22.4687 11.7787 21.2836 7.83202 18.8943 4.34399ZM8.05593 13.9013C7.01058 13.9013 6.15725 12.952 6.15725 11.7893C6.15725 10.6267 6.98925 9.67731 8.05593 9.67731C9.11191 9.67731 9.97588 10.6267 9.95454 11.7893C9.95454 12.952 9.11191 13.9013 8.05593 13.9013ZM15.065 13.9013C14.0196 13.9013 13.1652 12.952 13.1652 11.7893C13.1652 10.6267 13.9983 9.67731 15.065 9.67731C16.121 9.67731 16.985 10.6267 16.9636 11.7893C16.9636 12.952 16.1317 13.9013 15.065 13.9013Z"
                                    fill="white"
                                />
                            </svg>
                        </button>
                    </div>
                    <div className={classes.version}>
                        <h5>Версия лаунчера: {version}</h5>
                    </div>
                </div>
            </If>
        </div>
    );
}

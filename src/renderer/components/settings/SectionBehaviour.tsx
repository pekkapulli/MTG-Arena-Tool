/* eslint-disable @typescript-eslint/camelcase */
import React from "react";
import Toggle from "../misc/Toggle";
import Input from "../misc/Input";
import { useSelector } from "react-redux";
import store, { AppState } from "../../../shared/redux/stores/rendererStore";
import { reduxAction } from "../../../shared/redux/sharedRedux";
import css from "./Sections.css";
import { constants } from "mtgatool-shared";
const { IPC_ALL, IPC_RENDERER } = constants;

function clickBetaChannel(value: boolean): void {
  reduxAction(
    store.dispatch,
    {
      type: "SET_APP_SETTINGS",
      arg: {
        betaChannel: value,
      },
    },
    IPC_ALL ^ IPC_RENDERER
  );
}

function clickAutoLogin(value: boolean): void {
  reduxAction(
    store.dispatch,
    {
      type: "SET_APP_SETTINGS",
      arg: {
        autoLogin: value,
      },
    },
    IPC_ALL ^ IPC_RENDERER
  );
}

function clickLaunchToTray(value: boolean): void {
  reduxAction(
    store.dispatch,
    {
      type: "SET_APP_SETTINGS",
      arg: {
        launchToTray: value,
      },
    },
    IPC_ALL ^ IPC_RENDERER
  );
}

function clickStartup(value: boolean): void {
  reduxAction(
    store.dispatch,
    { type: "SET_SETTINGS", arg: { startup: value } },
    IPC_ALL ^ IPC_RENDERER
  );
}

function clickCloseOnMatch(value: boolean): void {
  reduxAction(
    store.dispatch,
    { type: "SET_SETTINGS", arg: { close_on_match: value } },
    IPC_ALL ^ IPC_RENDERER
  );
}

function clickCloseToTray(value: boolean): void {
  reduxAction(
    store.dispatch,
    { type: "SET_SETTINGS", arg: { close_to_tray: value } },
    IPC_ALL ^ IPC_RENDERER
  );
}

function changeExportFormat(value: string): void {
  reduxAction(
    store.dispatch,
    { type: "SET_SETTINGS", arg: { export_format: value } },
    IPC_ALL ^ IPC_RENDERER
  );
}

export default function SectionBehaviour(): JSX.Element {
  const settings = useSelector((state: AppState) => state.settings);
  const appSettings = useSelector((state: AppState) => state.appsettings);
  return (
    <>
      <Toggle
        text={"Beta updates channel"}
        value={appSettings.betaChannel}
        callback={clickBetaChannel}
      />
      <Toggle
        text={"Login/offline mode automatically"}
        value={appSettings.autoLogin}
        callback={clickAutoLogin}
      />
      <Toggle
        text={"Launch to tray"}
        value={appSettings.launchToTray}
        callback={clickLaunchToTray}
      />
      <Toggle
        text={"Launch on startup"}
        value={settings.startup}
        callback={clickStartup}
      />
      <Toggle
        text={"Close main window on match found"}
        value={settings.close_on_match}
        callback={clickCloseOnMatch}
      />
      <Toggle
        text={"Close to tray"}
        value={settings.close_to_tray}
        callback={clickCloseToTray}
      />
      <div className={css.centered_setting_container}>
        <label>Export Format:</label>
        <Input
          value={settings.export_format}
          placeholder="$Name,$Count,$SetName,$SetCode,$Rarity,$Type"
          callback={changeExportFormat}
        />
      </div>

      <div className={css.settings_note}>
        <i>
          Possible variables: $Name, $Count, $SetName, $SetCode, $Collector,
          $Rarity, $Type, $Cmc
        </i>
      </div>
    </>
  );
}

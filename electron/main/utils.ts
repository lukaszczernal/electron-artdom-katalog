import { BROWSER_EVENTS } from "../../src/events";
import { Page } from "../../src/models";
import { DownloadStatus } from "../../src/models/store";

type APP_DOWNLOAD_STATUS<T extends BROWSER_EVENTS> =
  T extends BROWSER_EVENTS.APP_DOWNLOAD_STATUS ? DownloadStatus : void;

type APP_DOWNLOAD_PROGRESS<T extends BROWSER_EVENTS> =
  T extends BROWSER_EVENTS.APP_DOWNLOAD_PROGRESS ? number : void;


type CLIENT_CATALOG_SUCCESS<T extends BROWSER_EVENTS> =
  T extends BROWSER_EVENTS.CLIENT_CATALOG_SUCCESS ? Page[] : void;


type CLIENT_FILE_UPLOAD_FAIL<T extends BROWSER_EVENTS> =
  T extends BROWSER_EVENTS.CLIENT_FILE_UPLOAD_FAIL ? string : void;

type CLIENT_FILE_UPLOAD_SUCCESS<T extends BROWSER_EVENTS> =
  T extends BROWSER_EVENTS.CLIENT_FILE_UPLOAD_SUCCESS ? string : void;


type CLIENT_FILE_REMOVE_FAIL<T extends BROWSER_EVENTS> =
  T extends BROWSER_EVENTS.CLIENT_FILE_REMOVE_FAIL ? string : void;

type CLIENT_FILE_REMOVE_SUCCESS<T extends BROWSER_EVENTS> =
  T extends BROWSER_EVENTS.CLIENT_FILE_REMOVE_SUCCESS ? string : void;


type Payload<T extends BROWSER_EVENTS> =
  | APP_DOWNLOAD_STATUS<T>
  | APP_DOWNLOAD_PROGRESS<T>
  | CLIENT_CATALOG_SUCCESS<T>
  | CLIENT_FILE_UPLOAD_FAIL<T>
  | CLIENT_FILE_UPLOAD_SUCCESS<T>
  | CLIENT_FILE_REMOVE_FAIL<T>
  | CLIENT_FILE_REMOVE_SUCCESS<T>;

type EventType<T extends BROWSER_EVENTS> = {
  type: T;
  payload: Payload<T>;
};

type EventReply<T extends BROWSER_EVENTS> = [
  typeof BROWSER_EVENTS.EVENTS_CHANNEL,
  EventType<T>
];

export const reduxEvent = <T extends BROWSER_EVENTS>(
  type: T,
  payload?: Payload<T>
): EventReply<T> => [BROWSER_EVENTS.EVENTS_CHANNEL, { type, payload }];

import { expect } from "detox";
import {
  getElementById,
  openDeeplink,
  tapByText,
  waitForElementByID,
  waitForElementByText,
} from "../../helpers";
import * as bridge from "../../bridge/server";

const proceedButtonId = "Proceed";
const baseLink = "myledger";

export default class ManagerPage {
  getManagerTitle = () => getElementById("manager-title");
  getPairDeviceButton = () => getElementById("pair-device");
  getProceedButton = () => getElementById(proceedButtonId);
  waitProceedButton = () => waitForElementByID(proceedButtonId);

  openViaDeeplink() {
    return openDeeplink(baseLink);
  }

  expectManagerPage() {
    return expect(this.getManagerTitle()).toBeVisible();
  }

  async addDevice(deviceName: string) {
    await this.expectManagerPage();
    await this.getPairDeviceButton().tap();
    bridge.addDevices();
    await waitForElementByText(deviceName, 3000);
    await tapByText(deviceName);
    bridge.setInstalledApps(); // tell LLM what apps the mock device has
    bridge.openNano();
    await this.waitProceedButton();
    await this.getProceedButton();
  }
}

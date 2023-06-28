import test from "../../fixtures/common";
import { expect } from "@playwright/test";
import { DiscoverPage } from "../../models/DiscoverPage";
import { Layout } from "../../models/Layout";
import { Drawer } from "../../models/Drawer";
import { Modal } from "../../models/Modal";
import { DeviceAction } from "../../models/DeviceAction";
import { LiveApp } from "../../models/LiveApp";

test.use({ userdata: "1AccountBTC1AccountETH" });

let continueTest = false;

test.beforeAll(async ({ request }) => {
  continueTest = await LiveApp.start(request);
});

test.afterAll(() => {
  LiveApp.stop();
});

test("Wallet API methods", async ({ page }) => {
  if (!continueTest) return;

  const discoverPage = new DiscoverPage(page);
  const drawer = new Drawer(page);
  const modal = new Modal(page);
  const layout = new Layout(page);
  const deviceAction = new DeviceAction(page);
  const liveApp = new LiveApp(page);

  await test.step("account.request", async () => {
    await layout.goToDiscover();
    await discoverPage.openTestApp();
    await drawer.continue();
    await drawer.waitForDrawerToDisappear();

    const { id, response } = liveApp.send({
      method: "account.request",
      params: {
        currencyIds: ["ethereum", "bitcoin"],
      },
    });

    await drawer.selectCurrency("bitcoin");
    await drawer.selectAccount("bitcoin");

    await expect(response).resolves.toStrictEqual({
      jsonrpc: "2.0",
      id,
      result: {
        rawAccount: {
          id: "2d23ca2a-069e-579f-b13d-05bc706c7583",
          address: "1xeyL26EKAAR3pStd7wEveajk4MQcrYezeJ",
          balance: "35688397",
          blockHeight: 194870,
          currency: "bitcoin",
          lastSyncDate: "2020-03-14T13:34:42.000Z",
          name: "Bitcoin 1 (legacy)",
          spendableBalance: "35688397",
        },
      },
    });
  });

  await test.step("account.receive", async () => {
    const { id, response } = liveApp.send({
      method: "account.receive",
      params: {
        accountId: "2d23ca2a-069e-579f-b13d-05bc706c7583",
      },
    });

    await deviceAction.openApp();
    await modal.waitForModalToDisappear();

    await expect(response).resolves.toStrictEqual({
      jsonrpc: "2.0",
      id,
      result: {
        address: "1xeyL26EKAAR3pStd7wEveajk4MQcrYezeJ",
      },
    });
  });
});

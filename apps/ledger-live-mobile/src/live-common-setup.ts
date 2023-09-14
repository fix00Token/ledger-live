import Config from "react-native-config";
import { Observable, timer } from "rxjs";
import { map, debounce } from "rxjs/operators";
import { TraceContext, listen } from "@ledgerhq/logs";
import HIDTransport from "@ledgerhq/react-native-hid";
import withStaticURLs from "@ledgerhq/hw-transport-http";
import { retry } from "@ledgerhq/live-common/promise";
import { setEnv } from "@ledgerhq/live-env";
import {
  getCryptoCurrencyById,
  setSupportedCurrencies,
} from "@ledgerhq/live-common/currencies/index";
import { setWalletAPIVersion } from "@ledgerhq/live-common/wallet-api/version";
import { WALLET_API_VERSION } from "@ledgerhq/live-common/wallet-api/constants";
import { registerTransportModule } from "@ledgerhq/live-common/hw/index";
import type { TransportModule } from "@ledgerhq/live-common/hw/index";
import { setDeviceMode } from "@ledgerhq/live-common/hw/actions/app";
import { getDeviceModel } from "@ledgerhq/devices";
import { DescriptorEvent } from "@ledgerhq/hw-transport";
import VersionNumber from "react-native-version-number";
import type { DeviceModelId } from "@ledgerhq/types-devices";
import { Platform } from "react-native";
import { setSecp256k1Instance } from "@ledgerhq/live-common/families/bitcoin/wallet-btc/crypto/secp256k1";
import { setGlobalOnBridgeError } from "@ledgerhq/live-common/bridge/useBridgeTransaction";
import { prepareCurrency } from "./bridge/cache";
import BluetoothTransport from "./react-native-hw-transport-ble";
import "./experimental";
import logger from "./logger";

setGlobalOnBridgeError(e => logger.critical(e));
setDeviceMode("polling");
setWalletAPIVersion(WALLET_API_VERSION);
setSupportedCurrencies([
  "avalanche_c_chain",
  "axelar",
  "stargaze",
  "secret_network",
  "umee",
  "desmos",
  "onomy",
  "quicksilver",
  "persistence",
  "bitcoin",
  "ethereum",
  "bsc",
  "polkadot",
  "solana",
  "ripple",
  "litecoin",
  "polygon",
  "bitcoin_cash",
  "stellar",
  "dogecoin",
  "cosmos",
  "crypto_org",
  "crypto_org_croeseid",
  "celo",
  "dash",
  "tron",
  "tezos",
  "ethereum_classic",
  "zcash",
  "decred",
  "digibyte",
  "algorand",
  "qtum",
  "bitcoin_gold",
  "komodo",
  "pivx",
  "zencash",
  "vertcoin",
  "peercoin",
  "viacoin",
  "bitcoin_testnet",
  "ethereum_ropsten",
  "ethereum_goerli",
  "elrond",
  "hedera",
  "cardano",
  "osmosis",
  "filecoin",
  "fantom",
  "cronos",
  "moonbeam",
  "songbird",
  "flare",
  "near",
  "optimism",
  "optimism_goerli",
  "arbitrum",
  "arbitrum_goerli",
  "rsk",
  "bittorrent",
  "kava_evm",
  "evmos_evm",
  "energy_web",
  "astar",
  "metis",
  "boba",
  "moonriver",
  "velas_evm",
  "syscoin",
  "internet_computer",
  "klaytn",
  "polygon_zk_evm",
  "polygon_zk_evm_testnet",
  "base",
  "base_goerli",
  "stacks",
  "telos_evm",
  "coreum",
]);

const { VERBOSE } = Config;

/**
 * Sets up a printing of logs in the console/stdout
 *
 * The configuration is done with the env variable `VERBOSE`
 *
 * Usage: a filtering (only on console printing) on Ledger libs are possible:
 * - VERBOSE="apdu,hw,transport,hid-verbose" : filtering on a list of log `type` separated by a `,`
 * - VERBOSE=1 or VERBOSE=true : to print all logs
 *
 * Note: we should add a log level defined in our logger, different that `type`.
 */
if (VERBOSE) {
  const everyLogs = VERBOSE === "true" || VERBOSE === "1";
  const filters = everyLogs ? [] : VERBOSE.split(",");

  // eslint-disable-next-line no-console
  console.log(`Logs console display setup: ${JSON.stringify({ everyLogs, filters })}`);

  listen(({ type, message, context, ...rest }) => {
    if (!everyLogs && !filters.includes(type)) {
      return;
    }

    if (context) {
      // Displays the tracing context before the message for better readability in the console
      // eslint-disable-next-line no-console
      console.log(`${type}: ${JSON.stringify(context)}\n${message || ""}\n`, rest);
    } else {
      // eslint-disable-next-line no-console
      console.log(`${type}: ${message || ""}`, rest);
    }
  });
}

if (Config.BLE_LOG_LEVEL) BluetoothTransport.setLogLevel(Config.BLE_LOG_LEVEL);
if (Config.FORCE_PROVIDER && !isNaN(parseInt(Config.FORCE_PROVIDER, 10)))
  setEnv("FORCE_PROVIDER", parseInt(Config.FORCE_PROVIDER, 10));
// Add support of HID (experimental until we stabilize it)
registerTransportModule({
  id: "hid",
  // prettier-ignore
  // eslint-disable-next-line consistent-return
  open: (id: string, timeoutMs?: number, context?: TraceContext) => {
    if (id.startsWith("usb|")) {
      const devicePath = JSON.parse(id.slice(4));
      return retry(() => HIDTransport.open(devicePath, timeoutMs, context), {
        maxRetry: 2
      });
    }
  },
  disconnect: id =>
    id.startsWith("usb|")
      ? Promise.resolve() // nothing to do
      : null,
  discovery: new Observable<DescriptorEvent<string>>(o => HIDTransport.listen(o)).pipe(
    map(({ type, descriptor, deviceModel }) => {
      const name = deviceModel?.productName ?? "";
      return {
        type,
        id: `usb|${JSON.stringify(descriptor)}`,
        deviceModel,
        wired: true,
        name,
      };
    }),
    debounce(e => timer(e.type === "remove" ? 2000 : 0)),
  ),
});
// Add dev mode support of an http proxy
let DebugHttpProxy: ReturnType<typeof withStaticURLs>;
const httpdebug: TransportModule = {
  id: "httpdebug",
  open: id => (id.startsWith("httpdebug|") ? DebugHttpProxy.open(id.slice(10)) : null),
  disconnect: id =>
    id.startsWith("httpdebug|")
      ? Promise.resolve() // nothing to do
      : null,
};

if (__DEV__ && Config.DEVICE_PROXY_URL) {
  DebugHttpProxy = withStaticURLs(Config.DEVICE_PROXY_URL.split("|"));
  httpdebug.discovery = new Observable<DescriptorEvent<string>>(o => DebugHttpProxy.listen(o)).pipe(
    map(({ type, descriptor }) => ({
      type,
      id: `httpdebug|${descriptor}`,
      deviceModel: getDeviceModel((Config?.FALLBACK_DEVICE_MODEL_ID as DeviceModelId) || "nanoX"),
      wired: Config?.FALLBACK_DEVICE_WIRED === "YES",
      name: descriptor,
    })),
  );
} else {
  DebugHttpProxy = withStaticURLs([]);
}

registerTransportModule(httpdebug);
// BLE is always the fallback choice because we always keep raw id in it
registerTransportModule({
  id: "ble",
  open: (id: string, timeoutMs?: number, context?: TraceContext) =>
    BluetoothTransport.open(id, timeoutMs, context),
  disconnect: id => BluetoothTransport.disconnect(id),
});

if (process.env.NODE_ENV === "production") {
  const value =
    Platform.OS === "ios"
      ? `llm-ios/${VersionNumber.appVersion}`
      : `llm-android/${VersionNumber.appVersion}`;
  setEnv("LEDGER_CLIENT_VERSION", value);
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
setSecp256k1Instance(require("./logic/secp256k1"));

prepareCurrency(getCryptoCurrencyById("ethereum"));

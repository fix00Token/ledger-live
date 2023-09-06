import { CosmosMessage } from "./types";

export const getMainMessage = (messages: CosmosMessage[]): CosmosMessage => {
  const messagePriorities: string[] = [
    "unbond",
    "redelegate",
    "delegate",
    "withdraw_rewards",
    "transfer",
  ];
  const sortedTypes = messages
    .filter(m => messagePriorities.includes(m.type))
    .sort((a, b) => messagePriorities.indexOf(a.type) - messagePriorities.indexOf(b.type));
  return sortedTypes[0];
};

export const sortObjectKeysDeeply = src => {
  let out;

  if (Array.isArray(src)) {
    return src.map(function (item) {
      return sortObjectKeysDeeply(item);
    });
  }

  if (typeof src === "object") {
    out = {};

    Object.keys(src)
      .sort((a, b) => a.localeCompare(b))
      .forEach(function (key) {
        out[key] = sortObjectKeysDeeply(src[key]);
      });

    return out;
  }

  return src;
};

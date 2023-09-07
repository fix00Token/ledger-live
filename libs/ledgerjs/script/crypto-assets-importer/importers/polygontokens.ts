import fs from "fs";
import { fetchTokens } from "../fetch";
import { log } from "console";

type PolygonToken = [
  string, // parent currency id
  string, // token
  string, // ticker
  number, // precision
  string, // name
  string, // ledgerSignature
  string, // contract address
  boolean, // disabled counter value
  boolean, // delisted
  string?, // legacy
  string?, // legacy
];

export const importPolygonTokens = async (outputDir: string) => {
  log("importing polygon tokens...");
  const polygonTokens = await fetchTokens<PolygonToken[]>("polygon-erc20.json");
  if (polygonTokens) {
    fs.writeFileSync(`${outputDir}/polygon-erc20.json`, JSON.stringify(polygonTokens));

    const tokenTypeStringified = `type PolygonERC20Token = [
  string, // parent currency id
  string, // token
  string, // ticker
  number, // precision
  string, // name
  string, // ledgerSignature
  string, // contract address
  boolean, // disabled counter value
  boolean, // delisted
  string?, // legacy
  string?, // legacy
];`;

    const tokensStringified = `const tokens: PolygonERC20Token[] = ${JSON.stringify(
      polygonTokens,
      null,
      2,
    )}; `;

    const exportStringified = `export default tokens;`;

    fs.writeFileSync(
      `${outputDir}/polygon-erc20.ts`,
      `${tokenTypeStringified}

${tokensStringified}

${exportStringified}
    `,
    );

    log("import polygon tokens success");
  }
};

const snapId = `local:${window.location.origin}/snap.manifest.json`;

async function connect() {
  await (window as any).ethereum.request({
    method: "wallet_requestSnaps",
    params: { [snapId]: {} },
  });
  log("Snap installed");
}

async function invoke(method: string, params?: any) {
  return (window as any).ethereum.request({
    method: "wallet_invokeSnap",
    params: {
      snapId,
      request: { method, params },
    },
  });
}

function log(msg: string) {
  const el = document.getElementById("log");
  if (el) el.textContent += `${msg}\n`;
}

async function lookupHiveAccount(pubkey: string): Promise<string | null> {
  try {
    const res = await fetch("https://api.hive.blog", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "account_by_key_api.get_key_references",
        params: { keys: [pubkey] },
      }),
    });
    const json = await res.json();
    return json?.result?.accounts?.[0]?.[0] ?? null;
  } catch {
    return null;
  }
}

document.getElementById("connect")?.addEventListener("click", () => {
  connect().catch((err) => log(err.message));
});

document.getElementById("setMnemonic")?.addEventListener("click", async () => {
  const mnemonic = (document.getElementById("mnemonic") as HTMLInputElement).value;
  try {
    await invoke("initialize", { mnemonic });
    log("Mnemonic stored");
  } catch (err) {
    log((err as Error).message);
  }
});

document.getElementById("getAddresses")?.addEventListener("click", async () => {
  try {
    const res = await invoke("getAddresses");
    log(`BTC: ${res.btc}`);
    log(`ETH: ${res.eth}`);
    log(`APT: ${res.apt}`);
    log(`TRX: ${res.trx}`);
    log(`ATOM: ${res.atom}`);
    log(`SOL: ${res.sol}`);
    const account = await lookupHiveAccount(res.hive.active);
    if (account) {
      log(`HIVE account: ${account}`);
    } else {
      log(`HIVE owner: ${res.hive.owner}`);
      log(`HIVE active: ${res.hive.active}`);
      log(`HIVE posting: ${res.hive.posting}`);
      log(`HIVE memo: ${res.hive.memo}`);
    }
  } catch (err) {
    log((err as Error).message);
  }
});

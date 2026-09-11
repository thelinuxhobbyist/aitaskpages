const RELOAD_FLAG = "atp-stale-client-reload";

/** Reload once per tab session to recover stale JS after a deploy. */
export function reloadOnceForStaleClient(reason: string): boolean {
  if (typeof window === "undefined") return false;

  try {
    if (sessionStorage.getItem(RELOAD_FLAG)) return false;
    sessionStorage.setItem(RELOAD_FLAG, reason);
  } catch {
    // sessionStorage blocked — still try one reload
  }

  window.location.reload();
  return true;
}

export function clearStaleClientReloadFlag(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(RELOAD_FLAG);
  } catch {
    // ignore
  }
}

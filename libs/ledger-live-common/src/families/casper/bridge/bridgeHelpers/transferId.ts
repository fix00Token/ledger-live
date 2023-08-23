export function isTransferIdValid(id?: string): boolean {
  if (!id || !id.length) return true;
  if (/^\d+$/.test(id)) return true;

  return false;
}

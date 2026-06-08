function getCeilY(wx) {
    let ti = Math.max(0, Math.min(Math.floor(wx / TILE), profileLen - 1));
    return ceilBase + ceilProfile[ti];
}
function mkDiag(x1, y1, x2, y2, n) {
    let a = [];
    
    for (let i = 0; i < n; i++) {
        a.push({
            x1: Math.floor(x1 + (x2-x1)*(i/n)),
            x2: Math.ceil(x1 + (x2-x1)*((i+1)/n)),
            y: Math.round(y1 + (y2-y1)*((i+0.5)/n))
        });
    }
    return a;
}

function getCeilY(wx) {
    let ti = Math.max(0, Math.min(Math.floor(wx / TILE), profileLen - 1));
    return ceilBase + ceilProfile[ti];
}
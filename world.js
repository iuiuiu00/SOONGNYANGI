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

const profileLen = Math.ceil(CW / TILE) + 4;

const ceilProfile = [];

for (let i = 0; i < profileLen; i++) {
    let v = Math.sin(i*0.17)*10 + Math.sin(i*0.06)*8 + Math.sin(i*0.43)*4;
    
    ceilProfile.push(Math.max(0, Math.min(Math.round((v + 12) / TILE) * TILE, 28)));
}
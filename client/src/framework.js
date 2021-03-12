module.exports = {
    // Good W3 copypastas
    copyToClipboard: (str, type) => {
        const el = document.createElement('textarea');
        el.value = str;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        console.log(`${type} (${str}) copied to clipboard!`);
    },
    // gigabrain code
    transformFileSize: (bytes, si = false, dp = 1) => {
        const thresh = si ? 1000 : 1024;
        if (Math.abs(bytes) < thresh) return bytes + ' B';
    
        const units = si 
            ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'] 
            : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
        let u = -1;
        const r = 10**dp;
    
        do {
            bytes /= thresh;
            ++u;
        } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);
    
        return bytes.toFixed(dp) + ' ' + units[u];
    }
}
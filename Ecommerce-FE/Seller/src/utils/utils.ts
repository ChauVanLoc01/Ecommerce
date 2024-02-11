export const hash = (needHash: string) => {
    let hash = 0,
        i,
        chr
    if (needHash.length === 0) return hash
    for (i = 0; i < needHash.length; i++) {
        chr = needHash.charCodeAt(i)
        hash = (hash << 5) - hash + chr
        hash |= 0 // Convert to 32bit integer
    }
    return 'a' + hash
}

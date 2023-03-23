export default (obj: Record<string, any>) => {
    const queryString = Object.keys(obj)
        .map(k => `${k}=${encodeURIComponent(obj[k])}`)
        .join("&");

    return '?' + queryString
}
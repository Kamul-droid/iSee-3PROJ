const indicators = ['', 'K', 'M', 'B', 'T']

export default (number: number): string => {
    let i = 0
    while (i < indicators.length-1 && number >= 1000) {
        if (number < 1000) break;
        number = number / 1000;
        i++;
    }
    return `${number.toFixed(2)}${indicators[i]}`
}
export default (obj: Record<string, any>) => {
    const toEdit = {...obj}
    Object.keys(toEdit).forEach(k => {
        if (toEdit[k] === '') delete toEdit[k];
    })

    return toEdit
}
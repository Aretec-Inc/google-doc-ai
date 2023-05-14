module.exports = (d, text, pageNumber, valueType, contentT) => {

    let maxValue = (array, key) => {
        let highestValue = array?.sort((a, b) => b?.[key] - a?.[key])?.[0]?.[key]
        return highestValue ? highestValue : array?.[0]?.[key]
    }

    let lowestValue = (array, key) => {
        let leastValue = array?.sort((a, b) => a?.[key] - b?.[key])?.[0]?.[key]
        return leastValue ? leastValue : array?.[0]?.[key]
    }
    let textAnchor = d?.layout?.textAnchor || d?.textAnchor
    let startIndex = textAnchor?.textSegments?.[0]?.startIndex || 0
    let endIndex = textAnchor?.textSegments?.[0]?.endIndex || 0
    let boundingPoly = d?.layout?.boundingPoly || d?.boundingPoly || d?.pageAnchor?.pageRefs?.[0]?.boundingPoly
    let normalizedVertices = boundingPoly?.normalizedVertices

    let x1 = lowestValue(normalizedVertices, 'x')
    let y1 = lowestValue(normalizedVertices, 'y')
    let x2 = maxValue(normalizedVertices, 'x')
    let y2 = maxValue(normalizedVertices, 'y')

    let contentText = contentT || d?.textAnchor?.content || text.slice(startIndex, endIndex)
    let confidence= d?.confidence
    return {
        content: {
            text: contentText,
            type: valueType || 'text'

        },
        type: 'paragraph',
        // moreData:page 
        rect: {
            x1,
            y1,
            x2,
            y2,
        },
        pageNumber: pageNumber || 0,
        ...confidence?{confidence}:{}
       // id: btoa(contentText + '__' + pageNumber) //btoa is base64 encryption.
    }
}

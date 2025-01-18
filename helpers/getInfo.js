module.exports = (d, text, pageNumber, valueType, contentT) => {
    let maxValue = (array, key) => {
        let highestValue = array?.sort((a, b) => b?.[key] - a?.[key])?.[0]?.[key]
        return highestValue ? highestValue : array?.[0]?.[key]
    }

    let lowestValue = (array, key) => {
        let leastValue = array?.sort((a, b) => a?.[key] - b?.[key])?.[0]?.[key]
        return leastValue ? leastValue : array?.[0]?.[key]
    }

    // Handle both camelCase and snake_case variations
    let textAnchor = d?.layout?.textAnchor || d?.layout?.text_anchor || 
                     d?.textAnchor || d?.text_anchor
    
    let startIndex = textAnchor?.textSegments?.[0]?.startIndex || 
                     textAnchor?.text_segments?.[0]?.start_index || 
                     textAnchor?.text_segments?.[0]?.startIndex || 
                     textAnchor?.textSegments?.[0]?.start_index || 0
    
    let endIndex = textAnchor?.textSegments?.[0]?.endIndex || 
                   textAnchor?.text_segments?.[0]?.end_index || 
                   textAnchor?.text_segments?.[0]?.endIndex || 
                   textAnchor?.textSegments?.[0]?.end_index || 0

    let boundingPoly = d?.layout?.boundingPoly || d?.layout?.bounding_poly ||
                       d?.boundingPoly || d?.bounding_poly ||
                       d?.pageAnchor?.pageRefs?.[0]?.boundingPoly ||
                       d?.page_anchor?.page_refs?.[0]?.bounding_poly ||
                       d?.pageAnchor?.page_refs?.[0]?.boundingPoly ||
                       d?.page_anchor?.pageRefs?.[0]?.bounding_poly

    let normalizedVertices = boundingPoly?.normalizedVertices || 
                            boundingPoly?.normalized_vertices

    let x1 = lowestValue(normalizedVertices, 'x')
    let y1 = lowestValue(normalizedVertices, 'y')
    let x2 = maxValue(normalizedVertices, 'x')
    let y2 = maxValue(normalizedVertices, 'y')

    let contentText = contentT || 
                     d?.textAnchor?.content || d?.text_anchor?.content ||
                     text.slice(startIndex, endIndex)
    
    let confidence = d?.confidence

    return {
        content: {
            text: contentText,
            type: valueType || 'text'
        },
        type: 'paragraph',
        rect: {
            x1,
            y1,
            x2,
            y2,
        },
        pageNumber: pageNumber || 0,
        ...confidence ? {confidence} : {}
    }
}
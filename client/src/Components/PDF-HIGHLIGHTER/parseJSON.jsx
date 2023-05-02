

/*

//formFields.

{
          "fieldName": {
            "textAnchor": {
              "textSegments": [
                {
                  "startIndex": "2403",
                  "endIndex": "2421"
                }
              ]
            },
            "confidence": 0.99999213,
            "boundingPoly": {
              "normalizedVertices": [
                {
                  "x": 0.47569722,
                  "y": 0.8787879
                },
                {
                  "x": 0.6129483,
                  "y": 0.8787879
                },
                {
                  "x": 0.6129483,
                  "y": 0.88928604
                },
                {
                  "x": 0.47569722,
                  "y": 0.88928604
                }
              ]
            },
            "orientation": "PAGE_UP"
          },
          "fieldValue": {
            "textAnchor": {
              "textSegments": [
                {
                  "startIndex": "2379",
                  "endIndex": "2394"
                }
              ]
            },
            "confidence": 0.99999213,
            "boundingPoly": {
              "normalizedVertices": [
                {
                  "x": 0.5375817,
                  "y": 0.89520204
                },
                {
                  "x": 0.6388889,
                  "y": 0.89520204
                },
                {
                  "x": 0.6388889,
                  "y": 0.90656567
                },
                {
                  "x": 0.5375817,
                  "y": 0.90656567
                }
              ]
            },
            "orientation": "PAGE_UP"
          }
        }
*/




const getData = (d, text, pageNumber, valueType) => {

  let maxValue = (array, key) => {
    let highestValue = array.sort((a, b) => b[key] - a[key])[0][key]
    return highestValue ? highestValue : array[0][key]
  }

  let lowestValue = (array, key) => {
    let leastValue = array.sort((a, b) => a[key] - b[key])[0][key]
    return leastValue ? leastValue : array[0][key]
  }
  let textAnchor = d?.layout?.textAnchor || d?.textAnchor
  let startIndex = textAnchor?.textSegments[0]?.startIndex || 0
  let endIndex = textAnchor?.textSegments[0]?.endIndex || 0
  let boundingPoly = d?.layout?.boundingPoly || d?.boundingPoly
  let normalizedVertices = boundingPoly?.normalizedVertices

  let x1 = lowestValue(normalizedVertices, "x") //*pageWidth
  let y1 = lowestValue(normalizedVertices, "y")// *pageHeight
  let x2 = maxValue(normalizedVertices, "x") //*pageWidth
  let y2 = maxValue(normalizedVertices, "y")// *pageHeight


  return {
    content: {
      text: text.slice(startIndex, endIndex),
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
    pageNumber: pageNumber || 1,
    id:  btoa(text.slice(startIndex, endIndex) + "__" + pageNumber)
  }
}


export const getFormFields = (page, text, pageNumber) => {
  if (page?.formFields) {
    let fields = page?.formFields
    let formFields = Array.isArray(fields) && fields ?
      fields?.map(d => {

        const valueType = d?.valueType

        const fieldName = getData(d.fieldName, text, pageNumber, valueType)
        const fieldValue = getData(d.fieldValue, text, pageNumber, valueType)
        const id = `${fieldName.id}_${fieldValue.id}`


        return [
          Object.assign({}, fieldName, { id }, { fieldNameId: fieldName?.id }, { type: 'formFields' }),
          Object.assign({}, fieldValue, { id }, { fieldValueId: fieldValue?.id }, { type: 'formFields' })
        ]
      }) : []

    return formFields
  }
  else {
    return []
  }


}

export const getParagraphs = (page, text, pageNumber) => {


  let highlights = page?.paragraphs ? page?.paragraphs?.map(d => [getData(d, text, pageNumber)]) : []

  return highlights
}

export const parseAllPages = (json) => {

  let pages = json.pages
  let text = json.text

  //let highlights = []
  ///getData(page, text)

  let parsedData =pages? pages?.map((page, i) => {
    let gottenParas = getParagraphs(page, text, i)
    let gottenFields = getFormFields(page, text, i)
    return ({

      paragraphs: gottenParas ? gottenParas : [],
      formFields: gottenFields ? gottenFields : []

    })
  }):[]


  return parsedData
}
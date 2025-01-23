var btoa = require('btoa')
const { runQuery, isNull, getUniqueArrayOfObjects } = require('../helpers')
const { postgresDB, schema } = require('../config')

const getDocumentData = async (file_name) => {
    let myQuery = `SELECT id, file_name, file_address as template_file_address, user_id, original_file_name, is_completed, number_of_attempts, file_address, submission_id FROM ${schema}.documents where file_name='${file_name}'`

    const document = await runQuery(postgresDB, myQuery)
    return document
}

const getIsCompleted = (file_name) => {
    let myQuery = `SELECT is_completed FROM ${schema}.documents where file_name='${file_name}'`

    return new Promise(async (resolve, reject) => {
        try {
            let [data] = await runQuery(postgresDB, myQuery)
            let finalData = typeof data?.flat == "function" && data?.flat()
            let isCompleted = Boolean(finalData?.[0]?.is_completed)
            resolve(isCompleted)
        }
        catch (e) {
            console.log('e', e)
            resolve(false)
        }
    })
}

const getData = (d, text, pageNumber, valueType, contentT) => {
    if (d) {
        let maxValue = (array, key) => {
            let highestValue = array?.sort((a, b) => b[key] - a[key])?.[0]?.[key]
            return highestValue ? highestValue : array[0][key]
        }

        let lowestValue = (array, key) => {
            let leastValue = array?.sort((a, b) => a[key] - b[key])?.[0]?.[key]
            return leastValue ? leastValue : array[0][key]
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

        let contentText = contentT || d?.textAnchor?.content || text?.slice(startIndex, endIndex)
        return {
            //key_pair: d?.key_pair || null,
            content: {
                text: contentText,
                type: valueType || 'text',
                is_editable: textAnchor?.is_editable

            },
            type: 'paragraph',
            rect: {
                x1,
                y1,
                x2,
                y2,
            },
            pageNumber: pageNumber || 1,
            id: d?.id || btoa(contentText + '__' + pageNumber) //btoa is base64 encryption.
        }
    }
    else {
        console.log("something not right", d)
    }
}

const handlePagraph = (para, text, pageNumber) => {
    return [getData(para, text, pageNumber, 'paragraph')]
}

const handlePagraphs = (page, text) => {
    try {
        let pageNumber = page?.pageNumber
        let paras = JSON.parse(page.paragraphs)?.flat()

        if (Array.isArray(paras)) {
            return paras.map(d => handlePagraph(d, text, pageNumber))
        }
        else {
            console.log("Not Array, this can be a big problem !!! you're in trouble!", paras)
        }
    }
    catch (e) {
        console.log(e)
        return []
    }
}

const generateKeyPairStructure = ({ text, is_editable, x1, x2, y1, y2, pageNumber, id, isKey, key_pair }) => {

    const validatedText = key_pair?.[isKey ? 'validated_field_name' : 'validated_field_value']
    return (
        {
            isKey,
            key_pair,
            'content': {
                'text': isNull(validatedText) ? text : validatedText || 'null',
                'type': 'text',
                'is_editable': is_editable || false,
            },
            'type': 'formFields',
            'rect': {
                'x1': x1,
                'y1': y1,
                'x2': x2,
                'y2': y2
            },
            'pageNumber': pageNumber,
            'id': id,
            'fieldNameId': id,
        }
    )
}
const handleKeyPair = (key_pair) => {

    const field_name = key_pair?.field_name,
        field_value = key_pair?.field_value,
        time_stamp = key_pair?.time_stamp,
        validated_field_name = key_pair?.validated_field_name,
        validated_field_value = key_pair?.validated_field_value,
        updated_date = key_pair?.updated_date?.value,
        confidence = key_pair?.confidence,
        updated_by = key_pair?.updated_by,
        key_x1 = key_pair?.key_x1,
        key_x2 = key_pair?.key_x2,
        key_y1 = key_pair?.key_y1,
        key_y2 = key_pair?.key_y2,
        value_x1 = key_pair?.value_x1,
        value_x2 = key_pair?.value_x2,
        value_y1 = key_pair?.value_y1,
        value_y2 = key_pair?.value_y2,
        pageNumber = key_pair?.page_number,
        id = key_pair?.id


    return ([
        generateKeyPairStructure({
            isKey: true,
            text: field_name,
            is_editable: isNull(validated_field_name),
            x1: key_x1,
            x2: key_x2,
            y1: key_y1,
            y2: key_y2,
            key_pair,
            id
        }),
        generateKeyPairStructure({
            isKey: false,
            text: field_value,
            is_editable: isNull(validated_field_value),
            x1: value_x1,
            x2: value_x2,
            y1: value_y1,
            y2: value_y2,
            key_pair,
            id
        })
    ])
}

let getTheFormFieldsByPageNumber = (fields, number) => {
    let fieldsByNumber = Array.isArray(fields) && fields && fields?.filter(d => d?.page_number == number)
    return Array.isArray(fieldsByNumber) && fieldsByNumber.map(handleKeyPair)
}

function addGtValues(inferenceArray, groundTruthArray) {
    // First, handle inference items as before but with slightly modified logic
    const combinedArray = inferenceArray.map(inferenceItem => {
      const matchingGtItem = groundTruthArray.find(
        gtItem => gtItem.field_name === inferenceItem.field_name
      );
      
      if (!matchingGtItem) {
        return {
          ...inferenceItem,
          exists_in: 'inference_only'
        };
      }
  
      if (inferenceItem.field_value !== matchingGtItem.field_value) {
        return {
          ...inferenceItem,
          gt_value: matchingGtItem.field_value,
          exists_in: 'both'
        };
      }
      
      return {
        ...inferenceItem,
        exists_in: 'both'
      };
    });
  
    // Then, add ground truth items that don't exist in inference
    const remainingGtItems = groundTruthArray
      .filter(gtItem => !inferenceArray.some(
        inferenceItem => inferenceItem.field_name === gtItem.field_name
      ))
      .map(gtItem => ({
        ...gtItem,
        field_name: gtItem.field_name,
        field_value: null,  // or any default value you prefer
        gt_value: gtItem.field_value,
        exists_in: 'ground_truth_only'
      }));
  
    return [...combinedArray, ...remainingGtItems];
  }
  
const generateDataFromBigQuery = (req, res) => {
    return new Promise(async (resolve, reject) => {
        const file_name = req?.query?.file_name || req?.query?.file_name || req?.body?.file_name
        const sqlQuery_pdf_documents = `SELECT * FROM ${schema}.pdf_documents WHERE file_name='${file_name}'`
        const sqlQuery_form_key_pair = `SELECT * FROM ${schema}.schema_form_key_pairs WHERE file_name='${file_name}' order by confidence`
        const sqlQuery_gt_form_key_pair = `SELECT * FROM ${schema}.gt_schema_form_key_pair WHERE file_name='${file_name}' order by confidence`
        const sqlQuery_pdf_pages = `SELECT * FROM ${schema}.pdf_pages WHERE file_name='${file_name}'`

        let queries = [runQuery(postgresDB, sqlQuery_pdf_documents), runQuery(postgresDB, sqlQuery_form_key_pair),runQuery(postgresDB, sqlQuery_gt_form_key_pair), runQuery(postgresDB, sqlQuery_pdf_pages)]

        const result = await Promise.allSettled(queries)
        const [pdf_document, form_key_pair, gt_form_key_pair , pdf_pages] = result

        let pdf_text = ``
        if (pdf_document && pdf_document?.status == "fulfilled") {
            // console.log("PDF DOC")
            let pdf_doc_value = pdf_document?.value?.flat()?.[0]
            pdf_text = pdf_doc_value?.text
            isSchemaGenerated = Boolean(pdf_doc_value?.schema_id)
        }
        else {
            console.log("ERROR PDF_DOCUMENTS ", pdf_document)
        }

        let parsedPages;
        let pages = []
        let key_pairs = []

        if (pdf_pages && pdf_pages?.status == "fulfilled") {
            pages = pdf_pages?.value?.flat()

            if (form_key_pair && form_key_pair?.status == "fulfilled") {
                let unique_key_pairs = getUniqueArrayOfObjects(getUniqueArrayOfObjects(form_key_pair?.value?.flat(), "id"), "field_name")
                let gt_unique_key_pairs = getUniqueArrayOfObjects(getUniqueArrayOfObjects(gt_form_key_pair?.value?.flat(), "id"), "field_name")
                // console.log('inference_kp==>',unique_key_pairs)
                // console.log('gt_kp==>',gt_unique_key_pairs)
                key_pairs = addGtValues(unique_key_pairs , gt_unique_key_pairs)
            }

            parsedPages = pages.map(page => {
                let dimension = JSON.parse(page.dimensions)
                let heightDiff = dimension?.height - dimension.width //Difference of height
                let heightDiffPercent = (heightDiff / dimension.width) * 100 //Difference of height in percentage
                return (
                    Object.assign({}, page, {
                        pageNumber: page?.pageNumber,
                        paragraphs: handlePagraphs(page, pdf_text),
                        dimension: { heightDiffPercent, ...dimension },
                        formFields: getTheFormFieldsByPageNumber(key_pairs, page?.pageNumber)
                    })
                )
            })?.sort((a, b) => a.pageNumber - b.pageNumber)
        }
        else {
            console.log('ERROR PDF_PAGES ', pdf_pages)
        }
        resolve({ parsedPages, key_pairs })
    })
}

module.exports = {
    generateDataFromBigQuery,
    getIsCompleted,
    getDocumentData
}
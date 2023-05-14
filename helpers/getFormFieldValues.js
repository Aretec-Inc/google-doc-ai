const insertToDB = require('./insertToDB')
const get_info = require('./getInfo')

module.exports = (d, { type, pageNumber, text, exact_file_name_with_ext, isEntity }, isTesting = false) => {

    const valueType = d && d.valueType
    const fieldType = isEntity ? d?.type : null
    const fieldName = get_info((d.fieldName || d), text, pageNumber, valueType, fieldType)
    let theFieldValue = d.fieldValue || d || {}

    let normalizedValue = theFieldValue?.normalizedValue?.text
    let hasNormalizedValue = typeof normalizedValue == "string"

    if (hasNormalizedValue) {
        theFieldValue.textAnchor = { content: normalizedValue }
    }

    const fieldValue = get_info(theFieldValue, text, pageNumber, valueType)
    const fNameText = fieldName?.content?.text
    const fValueText = fieldValue?.content?.text

    const fNameRect = fieldName?.rect
    const fValueRect = fieldValue?.rect

    const fNameConfidence = fieldName?.confidence
    const fValueConfidence = fieldValue?.confidence

    const fN_x1 = fNameRect?.x1
    const fN_x2 = fNameRect?.x2
    const fN_y1 = fNameRect?.y1
    const fN_y2 = fNameRect?.y2

    const fV_x1 = fValueRect?.x1
    const fV_x2 = fValueRect?.x2
    const fV_y1 = fValueRect?.y1
    const fV_y2 = fValueRect?.y2
    let key_pairs_Data = {
        file_name: exact_file_name_with_ext,
        field_name: fNameText || "",
        field_value: fValueText || "",
        // validated_field_name: "nodejs",
        // validated_field_value,
        confidence: fNameConfidence || fValueConfidence,
        key_x1: fN_x1,
        key_x2: fN_x2,
        key_y1: fN_y1,
        key_y2: fN_y2,
        value_x1: fV_x1,
        value_x2: fV_x2,
        value_y1: fV_y1,
        value_y2: fV_y2,
        pageNumber: (pageNumber || 1),
        type,

        field_name_confidence: fNameConfidence,
        field_value_confidence: fValueConfidence,
    }
    //  console.log(fieldName, ":", fieldValue)
    if (exact_file_name_with_ext && !isTesting) {
        return insertToDB.gen_form_key_pair_values(key_pairs_Data)
    }
    else {
        // console.log(`COULDN'T FIND FILE NAME `, JSON.stringify(key_pairs_Data))
        //throw new Error({ code: "missing_info", message: "Missing filename name", developerInfo: { exact_file_name_with_ext, fNameText, fValueText, key_pairs_Data } });
        return key_pairs_Data
    }
}
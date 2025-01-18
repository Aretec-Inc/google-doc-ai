const insertToDB = require('./insertToDB')
const get_info = require('./getInfo')

module.exports = (d, { type, pageNumber, text, exact_file_name_with_ext }, isTesting = false) => {

    const valueType = d && (d?.valueType || d?.value_type)

    // Handle both camelCase and snake_case formats
    const fieldValue = get_info(d, text, pageNumber, valueType)
    const fNameText = d?.type
    const fValueText = d?.mentionText || d?.mention_text

    const fValueRect = fieldValue?.rect
    const fValueConfidence = fieldValue?.confidence

    // Extract coordinates, checking both formats
    const fV_x1 = fValueRect?.x1 || fValueRect?.x_1
    const fV_x2 = fValueRect?.x2 || fValueRect?.x_2
    const fV_y1 = fValueRect?.y1 || fValueRect?.y_1
    const fV_y2 = fValueRect?.y2 || fValueRect?.y_2

    let key_pairs_Data = {
        file_name: exact_file_name_with_ext,
        field_name: fNameText || "",
        field_value: fValueText || "",
        confidence: fValueConfidence || 0,
        key_x1: null,
        key_x2: null,
        key_y1: null,
        key_y2: null,
        value_x1: fV_x1,
        value_x2: fV_x2,
        value_y1: fV_y1,
        value_y2: fV_y2,
        pageNumber: (pageNumber || 1),
        type,
        data_types: typeof(fValueText),
        field_name_confidence: 0,
        field_value_confidence: fValueConfidence,
    }

    console.log("key pairs data", key_pairs_Data)

    if (exact_file_name_with_ext && !isTesting) {
        return insertToDB.gen_form_key_pair_values(key_pairs_Data)
    } else {
        return key_pairs_Data
    }
}
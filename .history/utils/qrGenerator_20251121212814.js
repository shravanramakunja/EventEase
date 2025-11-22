// utils/qrGenerator.js
const QRCode = require("qrcode");

/**
 * Generate a QR code as a Base64 PNG string.
 * @param {Object} data - The JSON data to encode inside the QR.
 * @returns {Promise<string>} Base64 QR image
 */
exports.generateQR = async (data) => {
  try {
    const jsonStr = JSON.stringify(data);
    return await QRCode.toDataURL(jsonStr);
  } catch (err) {
    console.error("QR Generation Error →", err);
    throw err;
  }
};

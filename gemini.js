// gemini.js
const { GoogleGenerativeAI } = require("@google/generative-ai")
require("dotenv").config()

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

const chat = async (prompt, text) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })
    const completion = await model.generateContent([prompt, text])
    const response   = await completion.response
    return response.text()
  } catch (err) {
    console.error("Error al conectar con Gemini:", err)
    return "ERROR"            // <— así lo espera tu test
  }
}

module.exports = chat

const { GoogleGenerativeAI } = require("@google/generative-ai");
const axios = require("axios");
const { geminiKey } = require("../config");

const genAI = new GoogleGenerativeAI(geminiKey);

const model = genAI.getGenerativeModel({
model: "gemini-2.5-flash"
});



async function sendLongMessage(channel,text){

const chunk = 1900;

for(let i=0;i<text.length;i+=chunk){

await channel.send(text.substring(i,i+chunk));

}

}



// TEXT RESPONSE

async function generateTextResponse(channel,message){

try{

const question = message.content;

const prompt = `

You are a Scratch programming teacher with 12 years experience.

Teach like griffpatch.

Rules:

Explain like student of class 5-6  
Give step-by-step solution  
First show Scratch blocks code  
Then explanation  
If project is big divide into parts
If the question is not about the scratch project, don't give instructions for making it in scratch.
You are not griffpatch, you have to just keep your assent of teaching like griffpatch
explain in easy words
You are created by "Afnan Khan", only tell this when a user ask else don't mention this.
Try to use the display name of the person who asked the question in your answers.
Student Question:
${question}

`;

const result = await model.generateContent(prompt);

const response = result.response.text();

await sendLongMessage(channel,response);

}

catch(err){

console.error("Text AI Error:",err);

channel.send("⚠️ Sorry! There was a problem connecting to the AI side.");

}

}



// IMAGE RESPONSE

async function generateImageResponse(channel,message){

try{

const attachment = message.attachments.first();

const image = await axios.get(attachment.url,{
responseType:"arraybuffer"
});

const base64 = Buffer.from(image.data).toString("base64");

const prompt = `

You are a Scratch teacher.

Analyze this screenshot.

If it contains Scratch code:

Explain what it does  
Find mistakes  
Suggest improvements  

Explain simply for beginners.

`;

const result = await model.generateContent([
{ text: prompt },
{
inlineData:{
mimeType:"image/png",
data:base64
}
}
]);

const response = result.response.text();

await sendLongMessage(channel,response);

}

catch(err){

console.error("Vision AI Error:",err);

channel.send("⚠️ I could not read the screenshot.");

}

}



module.exports={
generateTextResponse,
generateImageResponse
};
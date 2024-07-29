const db = require("../models");
const Course = db.course;
const axios = require("axios");
const { OpenAI } = require("openai");
const { YoutubeTranscript } = require("youtube-transcript");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const createCourse = async (req, res) => {
  const userId = req.params.userId;
  const { subject, manualChapters, numChapters } = req.body;

  let chaptersArray;

  if (manualChapters && manualChapters.length > 0) {
    chaptersArray = manualChapters;
  } else {
    const format = {
      chapters: [
        {
          title: "chapter of title with max length of 15 words",
          topics: [
            { title: "topic of title with max length of 15 words" },
            { title: "topic of title with max length of 15 words" },
            { title: "topic of title with max length of 15 words" },
          ],
        },
      ],
    };

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a helpful AI that is able to generate courses with individual sub-topics on any subject, store all chapters and topics in a JSON array. Generate up to 7 chapters, depending on the complexity of the subject. \nYou are to output the following in json format: ${JSON.stringify(
              format
            )} \nDo not put quotation marks or escape character \\ in the output fields.`,
          },
          {
            role: "user",
            content: `Generate a comprehensive course based on ${subject} with ${numChapters} chapters and 3 topics per chapter.`,
          },
        ],
        temperature: 0.9,
        max_tokens: 1000,
        frequency_penalty: 0.0,
        presence_penalty: 0.6,
        stop: [" Human:", " AI:"],
      });

      let message =
        response.choices[0].message?.content?.replace(/'/g, '"') ?? "";
      message = message.replace(/(\w)"(\w)/g, "$1'$2");

      const startIndex = message.indexOf("[");
      const endIndex = message.lastIndexOf("]") + 1;

      const jsonArrayString = message.slice(startIndex, endIndex);
      chaptersArray = JSON.parse(jsonArrayString);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error generating course content");
      return;
    }
  }

  try {
    const course = new Course({
      title: `${subject} Course`,
      description: `Comprehensive course on ${subject}`,
      subject: subject,
      chapters: chaptersArray,
      user: userId,
      createdBy: manualChapters ? "user" : "ai",
    });

    await course.save();
    res.send({ message: course._id, course: course });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error saving course");
  }
};

const generateTopics = async (req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  try {
    const courseId = req.params.courseId;
    const course = await Course.findById(courseId);

    if (!course) {
      res.write(`data: ${JSON.stringify({ error: "Course not found" })}\n\n`);
      res.end();
      return;
    }

    for (const [chapterIndex, chapter] of course.chapters.entries()) {
      while (chapter.topics.length < 2) {
        chapter.topics.push({ title: `Additional topic for ${chapter.title}` });
      }
      if (chapter.topics.length > 3) {
        chapter.topics = chapter.topics.slice(0, 3);
      }

      for (const [topicIndex, topic] of chapter.topics.entries()) {
        const videoUrl = await generateYouTubeVideo(topic.title);
        const transcript = await getTranscript(videoUrl);

        if (!topic.videoUrl) {
          topic.videoUrl = videoUrl;
        }

        if (transcript && !topic.summary) {
          console.log(transcript);
          const summary = await generateSummary(transcript);
          console.log(summary);
          topic.summary = summary.summary;
          console.log(topic.summary);
        }

        const numQuestions = Math.floor(Math.random() * 3) + 1;
        topic.conceptChecks = await getQuestion(
          topic.title,
          topic.summary,
          numQuestions
        );

        topic.generated = true;
        await course.save();
        res.write(
          `data: ${JSON.stringify({
            message: `Completed Chapter ${chapterIndex + 1}, Topic ${
              topicIndex + 1
            }`,
            chapterIndex,
            topicIndex,
          })}\n\n`
        );
      }
    }

    res.write(
      `data: ${JSON.stringify({
        message: "All topics generated successfully",
      })}\n\n`
    );
    res.end();
  } catch (error) {
    console.error(error);
    res.write(
      `data: ${JSON.stringify({ error: "Internal Server Error" })}\n\n`
    );
    res.end();
  }
};

const generateYouTubeVideo = async (title) => {
  try {
    const searchQuery = encodeURIComponent(title);

    const { data } = await axios.get(
      `https://www.googleapis.com/youtube/v3/search?key=${process.env.YOUTUBE_API_KEY}&q=${searchQuery}&videoDuration=medium&videoEmbeddable=true&type=video&maxResults=5`
    );

    const videoId = data.items[0].id.videoId;
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

    return videoUrl;
  } catch (error) {
    console.error(
      "Error generating YouTube video:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

const generateSummary = async (transcript) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an AI capable of summarising a youtube transcript, store the summary in a JSON object. \nYou are to output the following in json format: ${JSON.stringify(
            {
              summary: "summary of the transcript",
            }
          )} \nDo not put quotation marks or escape character \\ in the output fields.`,
        },
        {
          role: "user",
          content:
            "summarize in 250 words or less and do not talk of the sponsors or anything unrelated to the main topic, also do not introduce what the summary is about.\n" +
            transcript,
        },
      ],
      temperature: 0.9,
      max_tokens: 300,
      frequency_penalty: 0.0,
      presence_penalty: 0.6,
      stop: [" Human:", " AI:"],
    });

    let message = response.choices[0].message?.content;

    const startIndex = message.indexOf("{");
    const endIndex = message.lastIndexOf("}") + 1;

    const jsonObjectString = message.slice(startIndex, endIndex);
    const summary = JSON.parse(jsonObjectString);

    return summary;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getQuestion = async (title, transcript, numQuestions) => {
  const format = {
    questions: [
      {
        question: "question",
        answer: "answer from one of the 4 options with max length of 15 words",
        options: [
          "option1 with max length of 15 words",
          "option2 with max length of 15 words",
          "option3 with max length of 15 words",
          "option4 with max length of 15 words",
        ],
      },
    ],
  };

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-1106-preview",
      messages: [
        {
          role: "system",
          content: `You are a helpful AI that is able to generate mcq questions and answers, the length of each answer should not be more than 15 words, store all answers and questions and options in a JSON object. \nYou are to output the following in json format: ${JSON.stringify(
            format
          )} \nDo not put quotation marks or escape character \\ in the output fields.`,
        },
        {
          role: "user",
          content: `Generate ${numQuestions} random mcq questions about ${title} with context of this transcript: ${transcript}`,
        },
      ],
      temperature: 0.9,
      max_tokens: 500,
      frequency_penalty: 0.0,
      presence_penalty: 0.6,
      stop: [" Human:", " AI:"],
    });

    let message = response.choices[0].message?.content;

    const startIndex = message.indexOf("{");
    const endIndex = message.lastIndexOf("}") + 1;

    const jsonObjectString = message.slice(startIndex, endIndex);
    const questions = JSON.parse(jsonObjectString);

    return questions.questions;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

async function getTranscript(videoId) {
  try {
    let transcript_arr = await YoutubeTranscript.fetchTranscript(videoId, {
      lang: "en",
      country: "EN",
    });
    let transcript = "";
    for (let t of transcript_arr) {
      transcript += t.text + " ";
    }
    return transcript.replaceAll("\n", "");
  } catch (error) {
    return "";
  }
}

module.exports = { createCourse, generateTopics, getQuestion };

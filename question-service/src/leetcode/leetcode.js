const configs = require('../config.js');
const axios = require('axios');

const DifficultyMap = {
  'BEGINNER': 'EASY',
  'INTERMEDIATE': 'MEDIUM',
  'EXPERT': 'HARD'
}

async function getQuestionList(difficulty, page, pageSize) {
  const headers = {
    'Content-Type': 'application/json'
  }

  const variables = {
    'categorySlug': '',
    'limit': pageSize,
    'skip': (page - 1) * pageSize,
    'filters': {
      'difficulty': DifficultyMap[difficulty]
    }
  };

  const graphqlQuery = {
    operationName: 'problemsetQuestionList',
    query: `query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
    problemsetQuestionList: questionList(
        categorySlug: $categorySlug
        limit: $limit
        skip: $skip
        filters: $filters
    ) {
        total: totalNum
        questions: data {
            title: title
            titleSlug: titleSlug
            likes: likes
            dislikes: dislikes
        }
    }
  }`,
    variables: variables
  }
  try {
    const res = await axios.post(`${configs.leetcode.url}${configs.leetcode.graphql}`, graphqlQuery, {
      headers: headers, validateStatus: function(status) {
        return status < 500; // Resolve only if the status code is less than 500
      }
    })
      .catch(err => {
        return { error: err.response.data }
      })

    if (res.status != 200) {
      return { error: res.data.errors[0].message }
    }

    return res.data.data;
  } catch (err) {
    console.log(`leetcode service err: ${err}`);
    return { error: res };
  }
}

async function getQuestion(titleSlug) {
  const headers = {
    'Content-Type': 'application/json'
  }

  const variables = {
    titleSlug: titleSlug
  };

  const graphqlQuery = {
    operationName: 'getQuestion',
    query: `query getQuestion($titleSlug: String!) {
    question(titleSlug: $titleSlug) {
        title
        titleSlug
        content
        difficulty
        likes
        dislikes
        exampleTestcases
        topicTags {
            name
        }
        codeSnippets {
            lang
            code
        }
        hints
        sampleTestCase
        questionDetailUrl
    }
}
`,
    variables: variables
  }
  try {
    const res = await axios.post(`${configs.leetcode.url}${configs.leetcode.graphql}`, graphqlQuery, {
      headers: headers, validateStatus: function(status) {
        return status < 500; // Resolve only if the status code is less than 500
      }
    })
      .catch(err => {
        return { error: err.response.data }
      })

    if (res.data.errors) {
      return { error: res.data.errors[0].message }
    }
    res.data.data.question.questionDetailUrl = `${configs.leetcode.url}${res.data.data.question.questionDetailUrl}`
    return res.data.data.question;
  } catch (err) {
    console.log(`leetcode service err: ${err}`);
    return { error: res };
  }

}

module.exports = {
  getQuestion,
  getQuestionList
}

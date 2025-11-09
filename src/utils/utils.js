// src/utils/utils.js

export const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
}

export const groupFeedbacks = (data) => {
  const feedbacks = []

  const feedbackMap = {}

  data.forEach(({ key, value }) => {
    const match = key.match(
      /(personName|personTag|personFeedback|personProfile)_(\d+)/
    )
    if (match) {
      const [, field, index] = match
      if (!feedbackMap[index]) {
        feedbackMap[index] = {}
      }
      feedbackMap[index][field] = value
    }
  })

  Object.keys(feedbackMap).forEach((index) => {
    const feedback = feedbackMap[index]
    if (feedback.personName && feedback.personTag && feedback.personFeedback) {
      feedbacks.push({
        personName: feedback.personName,
        personTag: feedback.personTag,
        personFeedback: feedback.personFeedback,
        personProfile: feedback.personProfile,
      })
    }
  })

  return feedbacks
}

export const arrayShuffle = (arr) => {
  const newArr = arr.slice()
  for (let i = newArr.length - 1; i > 0; i--) {
    const rand = Math.floor(Math.random() * (i + 1))
    ;[newArr[i], newArr[rand]] = [newArr[rand], newArr[i]]
  }
  return newArr
}

export const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}

export const safeParseJSON = (data) => {
  try {
    return JSON.parse(data)
  } catch (error) {
    return []
  }
}

// mock
import Mock from 'mockjs'
import { getUser, login } from './modules/user'
import { getData, getUserData } from './modules/study'
import credit from './modules/credit'
import lessons from './modules/lessons'
import answer from './modules/answer'


const all_url = {
  'development': 'http://localhost:8080/mock'
}

const  baseURL = all_url[process.env.NODE_ENV]

// Mock.mock(`${baseURL}/user/getUser`, 'post', getUser)

// 用户
Mock.mock(`${baseURL}/user/login`, 'post', login)
// 在线学习
Mock.mock(`${baseURL}/study/getData`, 'get', getData)
Mock.mock(`${baseURL}/study/getUserData`, 'get', getUserData)

// 积分
Mock.mock(`${baseURL}/credit/getData`, 'get', credit.getData)

// 课程
Mock.mock(`${baseURL}/lessons/getGraphicData`, 'get', lessons.getGraphicData)
Mock.mock(`${baseURL}/lessons/getVideoData`, 'get', lessons.getVideoData)
Mock.mock(`${baseURL}/lessons/getGraphicList`, 'get', lessons.getGraphicList)
Mock.mock(`${baseURL}/lessons/getGraphicDetails`, 'get', lessons.getGraphicDetails)
Mock.mock(`${baseURL}/lessons/getVideoList`, 'get', lessons.getVideoList)
Mock.mock(`${baseURL}/lessons/getVideoDetails`, 'get', lessons.getVideoDetails)

// 答题
Mock.mock(`${baseURL}/answer/getAnswerList`, 'get', answer.getAnswerList)




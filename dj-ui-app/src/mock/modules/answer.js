
import { Random } from 'mockjs'

const getAnswerList = () => {
  return {
    code: 0,
    message: 'success',
    success: true,
    data: {
      records: [
        {
          id: Random.id(),
          title: '2023年5月党建知识专项答题活动',
          image: 'answer-1.png',
          duration: 60,
          score: 99,
          time: [Random.datetime(), Random.datetime()],
          status: 1
        },
        {
          id: Random.id(),
          title: '1231231232131231313学习观测习近平新时代中国特色社会主义思想主题教育',
          image: 'answer-2.png',
          duration: 60,
          score: -1,
          time: [Random.datetime(), Random.datetime()],
          status: 1
        },
        {
          id: Random.id(),
          title: '新时代 新征程 新伟业 网络知识答题',
          image: 'answer-3.png',
          duration: 60,
          score: 80,
          time: [Random.datetime(), Random.datetime()],
          status: -1
        },
        {
          id: Random.id(),
          title: '2023年5月党建知识专项答题活动',
          image: 'answer-1.png',
          duration: 60,
          score: 99,
          time: [Random.datetime(), Random.datetime()],
          status: 1
        },
        {
          id: Random.id(),
          title: '1231231232131231313学习观测习近平新时代中国特色社会主义思想主题教育',
          image: 'answer-2.png',
          duration: 60,
          score: -1,
          time: [Random.datetime(), Random.datetime()],
          status: 1
        },
        {
          id: Random.id(),
          title: '新时代 新征程 新伟业 网络知识答题',
          image: 'answer-3.png',
          duration: 60,
          score: 80,
          time: [Random.datetime(), Random.datetime()],
          status: -1
        },
      ]
    }
  }
}

export default {
  getAnswerList
}

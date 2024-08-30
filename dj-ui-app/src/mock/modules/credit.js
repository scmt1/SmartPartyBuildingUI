import Mock, { Random } from 'mockjs'

// const mock = Mock.Mock()

// 学分明细

const randomCreditItem = () => {
  return Mock.mock({
    id: Random.id(),
    "sort|1": ["lesson", "answer"],
    "title|1": ["三严三实专题党课", `2023年${Random.integer(1, 10)}月党建知识专项答题`],
    completeTime: Random.datetime(),
    score: Random.integer(5, 30)
  })
}
const creditDetails = new Array(80).fill(null).map(() => randomCreditItem())

// console.log(creditDetails)

const getData = () => {
  return {
    code: 0,
    message: 'success',
    data: {
      userCredit: Random.integer(1000, 2000),
      creditDetails
    }
  }
}

export default {
  getData,
}

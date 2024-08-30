import { Random } from 'mockjs'

export const getData = (options) => {
  // console.log(options)
  return {
    code: 0,
    message: 'success',
    data: {
      swiperList: [
        {
          image: 'study-swiper.png',
          url: ''
        },
        {
          image: 'study-swiper.png',
          url: ''
        },
      ],
      graphicLessons: [
        {
          id: Random.id(),
          title: '中国人民政治协商会议第十三届全国委员会常务委员会关于学习贯彻中国共产党第二十次全国代表大会精神',
          sort: '学习宣传贯彻党的二十大精神',
        },
        {
          id: Random.id(),
          title: '中共中央关于认真学习宣传贯彻党的二十大精神的决定',
          sort: '学习宣传贯彻党的二十大精神',
          image: 'lesson-1.png'
        },
        {
          id: Random.id(),
          title: '栗战书:认真学习贯彻党的二十大精神推动新时代人大制度和人大工作完善发展',
          sort: '学习宣传贯彻党的二十大精神',
          image: 'lesson-2.png'
        },
      ],
      titleImage: 'title-image.png',
      videoLessons: [
        {
          id: Random.id(),
          title: '党史公开课 第一季',
          image: 'video-1.png'
        },
        {
          id: Random.id(),
          title: '一起走来的习近平',
          image: 'video-2.png'
        },
        {
          id: Random.id(),
          title: '党课公开课 第四季',
          image: 'video-3.png'
        },
        {
          id: Random.id(),
          title: '党史公开课 第一季',
          image: 'video-1.png'
        },
        {
          id: Random.id(),
          title: '一起走来的习近平',
          image: 'video-2.png'
        },
        {
          id: Random.id(),
          title: '党课公开课 第四季',
          image: 'video-3.png'
        },
      ],
      answerList: [
        {
          id: Random.id(),
          image: 'answer-1.png',
          status: 1
        },
        {
          id: Random.id(),
          image: 'answer-2.png',
          status: 0
        },
        {
          id: Random.id(),
          image: 'answer-3.png',
          status: 1
        }
      ]
    },

  }
}

export const getUserData = () => {
  return {
    code: 0,
    message: 'success',
    data: {
      creditCount: Random.integer(1000,2000),
      creditRank:  Random.integer(1, 100),
      lastLessonName: '党史公开课(二)',
      lastLessonProgress: Random.integer(20, 100)
    }
  }
}



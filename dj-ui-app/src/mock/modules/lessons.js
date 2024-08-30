import { Random } from 'mockjs'

const getGraphicData = () => {
  // console.log(options)
  return {
    code: 0,
    message: 'success',
    data: {
      swiperList: [
        {
          image: 'title.png',
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
      educationList: [
        {
          id: 1,
          image: 'education-1.png',
          url: ''
        },
        {
          id: 2,
          image: 'education-1.png',
          url: ''
        },
      ]
    },

  }
}

const getVideoData = () => {
  return {
    code: 0,
    message: '获取数据成功',
    success: true,
    data: {
      list: [
        {
          id: Random.id(),
          image: 'zhonggong.png',
          title: '中共党史公开课'
        },
        {
          id: Random.id(),
          image: 'renmen.png',
          title: '人们讲堂前沿 (第一季)'
        },
        {
          id: Random.id(),
          image: 'd.png',
          title: '党校公开课（第三季'
        },
        {
          id: Random.id(),
          image: 'pingyu.png',
          title: '平“语”近人——习近平喜欢的典故'
        },
        {
          id: Random.id(),
          image: 'guoshi.png',
          title: '国史讲堂-“党史微课”系列短视频'
        },
        {
          id: Random.id(),
          image: 'learn.png',
          title: '学习身边榜样'
        },
        {
          id: Random.id(),
          image: 'dangxiao.png',
          title: '党校公开课 （第四季）'
        },
        {
          id: Random.id(),
          image: 'xijinpin.png',
          title: '习近平新时代中国特色社会主义思想三十讲'
        },
        {
          id: Random.id(),
          image: 'xijinpin.png',
          title: '习近平新时代中国特色社会主义思想三十讲'
        },
      ]
    }
  }
}

const getGraphicList = () => {
  return {
    code: 0,
    message: 'success',
    success: true,
    data: {
      records: [
        {
          id: Random.id(),
          title: '中国人民政治协商会议第十三届全国委员会常务委员会关于学习贯彻中国共产党第二十次全国代表大会精神',
          sort: '学习宣传贯彻党的二十大精神',
          credit: 10,
          status: 1,
          learnedPerson: Random.integer(100, 2000)
        },
        {
          id: Random.id(),
          title: '中共中央关于认真学习宣传贯彻党的二十大精神的决定',
          sort: '学习宣传贯彻党的二十大精神',
          image: 'lesson-1.png',
          credit: 10,
          status: 1,
          learnedPerson: Random.integer(100, 2000)
        },
        {
          id: Random.id(),
          title: '栗战书:认真学习贯彻党的二十大精神推动新时代人大制度和人大工作完善发展',
          sort: '学习宣传贯彻党的二十大精神',
          image: 'lesson-2.png',
          credit: 10,
          status: 1,
          learnedPerson: Random.integer(100, 2000)
        },
        {
          id: Random.id(),
          title: '习近平在中国共产党第二十次全国代表大会上的讲话',
          image: 'title.png',
          credit: 20,
          status: 0,
          learnedPerson: Random.integer(100, 2000)
        }
      ]
    }
  }
}

const getGraphicDetails = () => {
  return {
    code: 0,
    message: 'success',
    success: true,
    data: {
      id: Random.id(),
      title: '中共中央关于认真学习宣传贯彻党的二十大精神的决定',
      time: Random.datetime(),
      credit: 10,
      status: 1,
      learnedPerson: Random.integer(200, 1000),
      textList: [
        '为深入学习宣传贯彻党的二十大精神，把全党全国各族人民的思想统一到党的二十大精神上来，把力量凝聚到党的二十大确定的各项任务上来，作出如下决定。',
        '一、充分认识学习宣传贯彻党的二十大精神的重大意义',
        '中国共产党第二十次全国代表大会于10月16日至22日在北京举行。这是在全党全国各族人民迈上全面建设社会主义现代化国家新征程、向第二个百年奋斗目标进军的关键时刻召开的一次十分重要的大会，是一次高举旗帜、凝聚力量、团结奋进的大会。大会高举中国特色社会主义伟大旗帜，坚持马克思列宁主义、毛泽东思想、邓小平理论、“三个代表”重要思想、科学发展观，全面贯彻习近平新时代中国特色社会主义思想，分析了国际国内形势，提出了党的二十大主题，回顾总结了过去5年的工作和新时代10年的伟大变革，阐述了开辟马克思主义中国化时代化新境界、中国式现代化的中国特色和本质要求等重大问题，对全面建设社会主义现代化国家、全面推进中华民族伟大复兴进行了战略谋划，对统筹推进“五位一体”总体布局、协调推进“四个全面”战略布局作出了全面部署。大会批准了习近平同志代表十九届中央委员会所作的《高举中国特色社会主义伟大旗帜，为全面建设社会主义现代化国家而团结奋斗》的报告，批准了十九届中央纪律检查委员会的工作报告，审议通过了《中国共产党章程（修正案）》，选举产生了新一届中央委员会和中央纪律检查委员会。',
        '习近平同志的报告，深刻阐释了新时代坚持和发展中国特色社会主义的一系列重大理论和实践问题，描绘了全面建设社会主义现代化国家、全面推进中华民族伟大复兴的宏伟蓝图，为新时代新征程党和国家事业发展、实现第二个百年奋斗目标指明了前进方向、确立了行动指南，是党和人民智慧的结晶，是党团结带领全国各族人民夺取中国特色社会主义新胜利的政治宣言和行动纲领，是马克思主义的纲领性文献。《中国共产党章程（修正案）》体现了党的十九大以来党的理论创新、实践创新、制度创新成果，体现了党的二十大报告确定的重要思想、重要观点、重大战略、重大举措，对坚持和加强党的全面领导、坚定不移推进全面从严治党、坚持和完善党的建设、推进党的自我革命提出了明确要求。',
        '党的二十届一中全会选举产生了以习近平同志为核心的新一届中央领导集体，一批经验丰富、德才兼备、奋发有为的同志进入中央领导机构，充分显示出中国特色社会主义事业蓬勃兴旺、充满活力。',
        '学习宣传贯彻党的二十大精神是当前和今后一个时期全党全国的首要政治任务，事关党和国家事业继往开来，事关中国特色社会主义前途命运，事关中华民族伟大复兴，对于动员全党全国各族人民更加紧密地团结在以习近平同志为核心的党中央周围，高举中国特色社会主义伟大旗帜，坚定道路自信、理论自信、制度自信、文化自信，为全面建设社会主义现代化国家、全面推进中华民族伟大复兴而团结奋斗，具有重大现实意义和深远历史意义。'
      ]
    }
  }
}


const getVideoList = () => {
  return {
    code: 0,
    message: 'success',
    success: true,
    data: {
      records: [
        {
          id: Random.id(),
          title: '学习贯彻习近平外交思想(—)',
          speaker: '谢锋',
          progress: 100,
          credit: 20,
          learnedPerson: Random.integer(200, 1000),
          image: 'video-bg-1.png'
        },
        {
          id: Random.id(),
          title: '学习贯彻习近平外交思想(二)',
          speaker: '华春莹',
          progress: 100,
          credit: 20,
          learnedPerson: Random.integer(200, 1000),
          image: 'video-bg-2.png'
        },
        {
          id: Random.id(),
          title: '伟大建党精神',
          speaker: '黄一兵',
          progress: 73,
          credit: 10,
          learnedPerson: Random.integer(200, 1000),
          image: 'video-bg-3.png'
        },
        {
          id: Random.id(),
          title: '党的光辉历程',
          speaker: '谢春涛',
          progress: 0,
          credit: 20,
          learnedPerson: Random.integer(200, 1000),
          image: 'video-bg-4.png'
        },
      ]
    }
  }
}

const getVideoDetails = () => {
  return {
    code: 0,
    message: 'success',
    success: true,
    data: {
      id: Random.id(),
      title: '党课开讲啦——学习贯彻习近平外交思想(—)',
      credit: 10,
      image: 'dangke-1.png',
      learnedPerson: Random.integer(200, 1000),
      progress: 100,
      otherLessons: [
        {
          id: Random.id(),
          image: 'video-bg-2.png',
          title: '学习贯彻习近平外交思想(二)'
        },
        {
          id: Random.id(),
          image: 'video-bg-3.png',
          title: '伟大建党精神'
        },
        {
          id: Random.id(),
          image: 'video-bg-4.png',
          title: '党的光辉历程'
        },
        {
          id: Random.id(),
          image: 'video-bg-2.png',
          title: '学习贯彻习近平外交思想(二)'
        },
        {
          id: Random.id(),
          image: 'video-bg-3.png',
          title: '伟大建党精神'
        },
      ],
      introduce: [
        '在喜迎党的二十大胜利召开之际，为深入学习贯彻习近平新时代中国特色社会主义思想，中共中央组织部策划，并联合中央广播电视总台组织协调有关中央单位，制作了习近平新时代中国特色社会主义思想《党课开讲啦》系列节目。',
        '本期节目邀请外交部党委委员、副部长谢锋担任主讲人，以《学习贯彻习近平外交思想推进中国特色大国外交》为题，以“六个感悟”为主线，沿着习近平总书记的外交足迹，领会习近平外交思想的核心要义和实践伟力。'
      ]
    }
  }
}

export default {
  getGraphicData,
  getVideoData,
  getGraphicList,
  getGraphicDetails,
  getVideoList,
  getVideoDetails
}

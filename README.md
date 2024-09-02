
<p align="center">
	<img src="vx_images/favicon.ico" />
</p>
<p align="center">
	<strong>适合互联网企业使用的开源智慧党建云平台</strong>
</p>
<p align="center">
	👉 <a href="https://www.scmintu.com/">https://www.scmintu.com/</a> 👈
</p>

<p align="center">
	<a target="_blank" href="https://spring.io/projects/spring-boot">
		<img src="https://img.shields.io/badge/spring%20boot-2.4.5-yellowgreen" />
	</a>
    <a target="_blank" href="https://www.oracle.com/java/technologies/javase/javase-jdk11-downloads.html">
		<img src="https://img.shields.io/badge/JDK-11-green.svg" />
	</a>
	<a target="_blank" href="http://www.gnu.org/licenses/lgpl.html">
		<img src="https://img.shields.io/badge/license-LGPL--3.0-blue" />
	</a>
</p>


-------------------------------------------------------------------------------

## 📚 项目介绍

SmartPartyBuilding是一套适合市、区、街道、园区等各级党政机关、企业、院校、医疗等机构等机构使用的开源智慧党建云平台，智慧党建云平台采用多租户模式构建数字党建新模式，采用微应用架构满足可扩展功能，市场落地案列多成熟稳定。
此项目是前端工程
- 后端工程：[https://gitee.com/scmt1/SmartPartyBuilding](https://gitee.com/scmt1/SmartPartyBuilding "智慧党建云平台（后端）")

## 🍎 项目特点

* 多租户模式构建数字党建新模式
* 采用微应用架构满足可扩展功能
* 使用`sofa boot`框架作为后端框架，便于维护
* 接口请求和响应数据采用签名机制，保证交易安全可靠
* 管理平台操作界面简洁、易用
* 使用`spring security`实现权限管理
* 前后端分离架构，方便二次开发

## 🍟 项目体验
- 智慧党建云平台：[https://scmintu.com/](https://scmintu.com/ "（公司官网查看）智慧党建云平台")

## 🥞 系统架构

> 开源智慧党建云平台架构图
![系统架构设计 (2)](vx_images/489673311227063.png)


> 核心技术栈

| 软件名称  | 描述 | 版本
|---|---|---
|Jdk | Java环境 | 1.11
|Spring Boot | 开发框架 | 2.4.5
|Redis | 分布式缓存 | 3.2.8 或 高版本
|MySQL | 数据库 | 5.7.X 或 8.0 高版本
|[Iview Ui](http://iview.talkingdata.com/) | iview Vue框架，前端开发使用 | 4.7.0
|[MyBatis-Plus](https://mp.baomidou.com/) | MyBatis增强工具 | 3.4.2
|[Hutool](https://www.hutool.cn/) | Java工具类库 | 5.6.6

> 项目结构（前后端分离了的，可以分明查看）

```lua

SmartPartyBuilding
├──dj-server-dwgl -- 党务管理后端
├──dj-ui-app-- 手机端
├──dj-ui-dwgl -- 党务管理前端
├──dj-ui-go-view -- 大屏前端
├──dj-ui-honor -- 荣誉管理
├──dj-ui-lesson -- 学习管理
├──dj-ui-message -- 短信管理
├──dj-ui-tzgl -- 统战管理
├──dj-fastcmscms -- cms系统
├──dj-portal -- 门户
├──dj-survey -- 投票问卷(前后端)
├──dj-xfzb -- 先锋指标(前后端)
├──go-wew-seme -- 大屏后端
├──party-paas-all-in-one-online -- 网关相关
└── vx_images -- 项目截图
```



## 🍿 功能介绍
1.党务管理平台（含组织管理、党员管理、三会一课管理、党费缴纳管理、党建新闻、荣誉管理、学习积分管理、投票问卷管理、大数据分析、党建AI助手）；
2.党建移动端（含我的支部、我的荣誉、个人积分、党费缴纳代缴、三会一课、党建咨询图文、视频）

> 功能结构图
![系统功能模块图 (1)](vx_images/35878331123919.png)

## 🍯 系统截图

`以下截图是从实际已完成功能界面截取,截图时间为：2024-08-29 08:59`
### 1、登录页面
![](vx_images/1.png)
### 2、首页
![](vx_images/2.png)
### 3、组织管理
![](vx_images/3.png)
组织详情
![](vx_images/4.png)
### 4、组织生活
组织生活概况
![](vx_images/5.png)
组织生活详情
![](vx_images/6.png)

### 5、党费管理

缴纳信息
![](vx_images/7.png)


### 6、党员管理
![](vx_images/8.png)
党员画像
![](vx_images/9.jpg)
### 7、党建新闻
新闻记录
![](vx_images/10.png)
新闻详情
![](vx_images/11.png)
新闻发布概况统计
![](vx_images/12.png)
### 8、投票问卷
![](vx_images/13.png)

创建问卷调查
![](vx_images/14.png)


问卷发布
![](vx_images/15.png)

![](vx_images/16.png)![](vx_images/17.png)
![](vx_images/18.png)


### 9、短信管理
自定义短信发送
![](vx_images/19.png)
自定义短信发送用户组
![](vx_images/20.png)
### 10、大屏
![](vx_images/21.png)

### 11、门户
<p align="center">
	<img src="vx_images/221.png" />
</p>



### 12、手机端
 ![首页](vx_images/23.png)         ![首页](vx_images/24.png)


![组织生活](vx_images/25.png)        ![党员缴纳个人党费](vx_images/26.png)



![党员代缴党费](vx_images/27.png)![党费缴纳概况](vx_images/28.png)




![未交党费名单 ](vx_images/29.png)![支部概况](vx_images/30.png)




![新闻 ](vx_images/32.png)![新闻详情](vx_images/33.png)

![荣誉管理](vx_images/34.png)


## 🥪开源版使用须知
***
* 需标注"代码来源于四川民图科技开源项目"后即可免费自用运营
* 前端运营时展示的内容不得使用四川民图科技相关信息
* 允许用于个人学习、教学案例
* 开源版不得直接倒卖源码
* 禁止将本项目的代码和资源进行任何形式的出售，产生的一切任何后果责任由侵权者自负

## 🥪商业合作
***
*  如果你想使用功能更完善的党建系统，请联系电话：400-855-2332 或者 微信 wxid_1uhin30bp6xv12
*  如果您想基于党建系统进行定制开发，我们提供有偿定制服务支持！
*  其他合作模式不限，欢迎来撩！
*  联系我们（商务请联系电话：400-855-2332 或者 微信 wxid_1uhin30bp6xv12）

## 🥪 关于我们
***
* 公司名称：四川民图科技有限公司
* 地址：成都市金牛区北三环路一段221号
* 电话：400-855-2332
* 业务合作：scmtkj@163.com
* 公司主页：https://www.scmintu.com/

## 🥪 微信
微信联系方式：微信号 wxid_1uhin30bp6xv12

![微信](vx_images/vx.jpg)



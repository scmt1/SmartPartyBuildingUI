// 主应用当中将默认值提出来，方便其他功能也要修改
import { initGlobalState } from 'qiankun';

// 初始化需要传递的对象
export const action = initGlobalState({ appId: ''});

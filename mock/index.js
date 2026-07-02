import Mock from './WxMock';
import homeMock from './home/index';

export default () => {
  const mockData = [...homeMock];
  mockData.forEach((item) => {
    Mock.mock(item.path, { code: 200, success: true, data: item.data });
  });
};

import Mock from './WxMock';
import homeMock from './home/index';
import searchMock from './search/index';
import my from './my/index';

export default () => {
  const mockData = [...homeMock, ...searchMock, ...my];
  mockData.forEach((item) => {
    Mock.mock(item.path, { code: 200, success: true, data: item.data });
  });
};

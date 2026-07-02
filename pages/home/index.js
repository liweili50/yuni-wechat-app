import Message from 'tdesign-miniprogram/message/index';
import request from '~/api/request';

// 获取应用实例
// const app = getApp()

Page({
  data: {
    statusHeight: 0,
    enable: false,
    swiperList: [],
    cardInfo: [],
    homeScrollStyle: '',
    searchKeyword: '',
    allCardInfo: [],
    // 发布
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName'), // 如需尝试获取用户信息可改为false
  },
  // 生命周期
  async onReady() {
    this.updateHomeScrollHeight();

    const [cardRes, swiperRes] = await Promise.all([
      request('/home/cards').then((res) => res.data),
      request('/home/swipers').then((res) => res.data),
    ]);

    const allCards = cardRes.data;
    this.setData({
      allCardInfo: allCards,
      cardInfo: allCards,
      focusCardInfo: allCards.slice(0, 3),
      swiperList: swiperRes.data,
    });
    this.updateHomeScrollHeight();
  },
  lifetimes: {
    ready() {
      const statusHeight = wx.getWindowInfo().statusBarHeight;
      this.setData({ statusHeight });
    },
  },
  onLoad(option) {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true,
      });
    }
    if (option.oper) {
      let content = '';
      if (option.oper === 'release') {
        content = '发布成功';
      } else if (option.oper === 'save') {
        content = '保存成功';
      }
      this.showOperMsg(content);
    }
  },
  onRefresh() {
    this.refresh();
  },
  onResize() {
    this.updateHomeScrollHeight();
  },
  async refresh() {
    this.setData({
      enable: true,
    });
    const [cardRes, swiperRes] = await Promise.all([
      request('/home/cards').then((res) => res.data),
      request('/home/swipers').then((res) => res.data),
    ]);

    const allCards = cardRes.data;
    setTimeout(() => {
      this.setData({
        enable: false,
        allCardInfo: allCards,
        cardInfo: allCards,
        focusCardInfo: allCards.slice(0, 3),
        swiperList: swiperRes.data,
      });
    }, 1500);
  },
  showOperMsg(content) {
    Message.success({
      context: this,
      offset: [120, 32],
      duration: 4000,
      content,
    });
  },
  searchTurn() {
    wx.navigateTo({ url: '/pages/search/index' });
  },

  onShow() {
    const keyword = wx.getStorageSync('searchKeyword');
    if (keyword) {
      wx.removeStorageSync('searchKeyword');
      this.setData({ searchKeyword: keyword });
      this.filterCards(keyword);
      this.updateHomeScrollHeight();
    }
  },

  filterCards(keyword) {
    const { allCardInfo } = this.data;
    if (!keyword) {
      this.setData({ cardInfo: allCardInfo, focusCardInfo: allCardInfo.slice(0, 3) });
      return;
    }
    const kw = keyword.toLowerCase();
    const filtered = allCardInfo.filter(
      (c) => c.desc.toLowerCase().includes(kw) || (c.tags && c.tags.some((t) => t.text.toLowerCase().includes(kw))),
    );
    this.setData({ cardInfo: filtered, focusCardInfo: filtered.slice(0, 3) });
  },

  clearSearch() {
    this.setData({ searchKeyword: '' });
    this.filterCards('');
    this.updateHomeScrollHeight();
  },

  updateHomeScrollHeight() {
    wx.nextTick(() => {
      const query = wx.createSelectorQuery();
      query.select('.home-content').boundingClientRect();
      query.select('.home-search-bar').boundingClientRect();
      query.exec(([contentRect, searchRect]) => {
        if (!contentRect || !contentRect.height) {
          return;
        }

        const windowInfo = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync();
        const tabHeight = (windowInfo.windowWidth / 750) * 96;
        const searchHeight = searchRect && searchRect.height ? searchRect.height : 0;
        const scrollHeight = Math.max(contentRect.height - searchHeight - tabHeight, 0);
        const homeScrollStyle = `height: ${scrollHeight}px;`;

        if (homeScrollStyle !== this.data.homeScrollStyle) {
          this.setData({ homeScrollStyle });
        }
      });
    });
  },
});

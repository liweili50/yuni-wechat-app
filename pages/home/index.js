import Message from 'tdesign-miniprogram/message/index';
import request from '~/api/request';

// 获取应用实例
// const app = getApp()
const COLLECTED_CARD_IDS_KEY = 'collectedCardIds';

Page({
  data: {
    statusHeight: 0,
    enable: false,
    swiperList: [],
    cardInfo: [],
    homeScrollStyle: '',
    searchKeyword: '',
    allCardInfo: [],
    focusCardInfo: [],
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
      focusCardInfo: this.getFocusCardInfo(allCards),
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
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline'],
    });

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
        focusCardInfo: this.getFocusCardInfo(allCards),
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

  onCardTap(e) {
    const { id } = e.currentTarget.dataset;

    if (!id) {
      return;
    }

    wx.navigateTo({ url: `/pages/detail/index?id=${id}` });
  },

  onShow() {
    const keyword = wx.getStorageSync('searchKeyword');
    if (keyword) {
      wx.removeStorageSync('searchKeyword');
      this.setData({ searchKeyword: keyword });
      this.filterCards(keyword);
      this.updateHomeScrollHeight();
      return;
    }

    if (this.data.allCardInfo.length) {
      this.refreshFocusCardInfo();
    }
  },

  onShareAppMessage() {
    return {
      title: 'yuni - 发现更多精彩内容',
      path: '/pages/home/index',
      imageUrl: '/static/home/swiper0.png',
    };
  },

  onShareTimeline() {
    return {
      title: 'yuni - 发现更多精彩内容',
      query: '',
      imageUrl: '/static/home/swiper0.png',
    };
  },

  filterCards(keyword) {
    const { allCardInfo } = this.data;
    if (!keyword) {
      this.setData({
        cardInfo: allCardInfo,
        focusCardInfo: this.getFocusCardInfo(allCardInfo),
      });
      return;
    }
    const kw = keyword.toLowerCase();
    const filtered = allCardInfo.filter(
      (c) => c.desc.toLowerCase().includes(kw) || (c.tags && c.tags.some((t) => t.text.toLowerCase().includes(kw))),
    );
    const focusCardInfo = this.getFocusCardInfo(filtered);
    this.setData({ cardInfo: filtered, focusCardInfo });
  },

  getCollectedIds() {
    const ids = wx.getStorageSync(COLLECTED_CARD_IDS_KEY) || [];
    return Array.isArray(ids) ? ids.map((item) => String(item)) : [];
  },

  getFocusCardInfo(cards) {
    const collectedIds = this.getCollectedIds();
    return cards.filter((item) => collectedIds.includes(String(item.id)));
  },

  refreshFocusCardInfo() {
    const { cardInfo } = this.data;
    this.setData({
      focusCardInfo: this.getFocusCardInfo(cardInfo),
    });
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

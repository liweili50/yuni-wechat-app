import request from '~/api/request';

const COLLECTED_CARD_IDS_KEY = 'collectedCardIds';

Page({
  data: {
    id: '',
    detail: null,
    isLoading: true,
    isCollected: false,
  },

  onLoad(options) {
    const { id = '' } = options;
    this.setData({ id });
    this.updateCollectedStatus(id);
    this.fetchDetail(id);
  },

  getCollectedIds() {
    const ids = wx.getStorageSync(COLLECTED_CARD_IDS_KEY) || [];

    return Array.isArray(ids) ? ids.map((item) => String(item)) : [];
  },

  updateCollectedStatus(id) {
    const collectedIds = this.getCollectedIds();

    this.setData({
      isCollected: collectedIds.includes(String(id)),
    });
  },

  async fetchDetail(id) {
    try {
      const res = await request('/home/cards');
      const cards = res.data.data || [];
      const detail = cards.find((item) => String(item.id) === String(id));

      this.setData({
        detail: detail || null,
        isLoading: false,
      });
      if (detail) {
        wx.setNavigationBarTitle({
          title: detail.desc,
        });
      }
    } catch (err) {
      console.warn('Failed to fetch card detail:', err);
      this.setData({ isLoading: false });
    }
  },

  onBackHome() {
    wx.switchTab({ url: '/pages/home/index' });
  },

  onCollectTap() {
    const { id, isCollected } = this.data;

    if (!id) {
      return;
    }

    try {
      const currentId = String(id);
      const collectedIds = this.getCollectedIds();
      const nextIds = isCollected ? collectedIds.filter((item) => item !== currentId) : [...collectedIds, currentId];

      wx.setStorageSync(COLLECTED_CARD_IDS_KEY, nextIds);
      this.setData({ isCollected: !isCollected });
    } catch (err) {
      console.warn('Failed to update collected card ids:', err);
    }
  },

  onShareAppMessage() {
    const { detail, id } = this.data;

    return {
      title: detail ? detail.desc : 'yuni - 发现更多精彩内容',
      path: `/pages/detail/index?id=${id}`,
      imageUrl: detail ? detail.url : '/static/home/swiper0.png',
    };
  },

  onShareTimeline() {
    const { detail, id } = this.data;

    return {
      title: detail ? detail.desc : 'yuni - 发现更多精彩内容',
      query: `id=${id}`,
      imageUrl: detail ? detail.url : '/static/home/swiper0.png',
    };
  },
});

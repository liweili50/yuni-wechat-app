import request from '~/api/request';

Page({
  data: {
    id: '',
    detail: null,
    isLoading: true,
  },

  onLoad(options) {
    const { id = '' } = options;
    this.setData({ id });
    this.fetchDetail(id);
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

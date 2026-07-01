import request from '~/api/request';
import useToastBehavior from '~/behaviors/useToast';

Page({
  behaviors: [useToastBehavior],

  data: {
    isLoad: false,
    service: [],
    personalInfo: {},
    gridList: [
      {
        name: '全部发布',
        icon: 'root-list',
        type: 'all',
        url: '',
      },
      {
        name: '审核中',
        icon: 'search',
        type: 'progress',
        url: '',
      },
      {
        name: '已发布',
        icon: 'upload',
        type: 'published',
        url: '',
      },
      {
        name: '草稿箱',
        icon: 'file-copy',
        type: 'draft',
        url: '',
      },
    ],

    settingList: [
      {
        name: '用户协议',
        url: '/pages/settings/user-agreement/index',
        icon: 'secured',
      },
      {
        name: '隐私政策',
        url: '/pages/settings/privacy/index',
        icon: 'info-circle',
      },
    ],
  },

  onLoad() {
    this.getServiceList();
  },

  async onShow() {
    const Token = wx.getStorageSync('access_token');
    if (Token) {
      let personalInfo = {};
      try {
        personalInfo = await this.getPersonalInfo();
      } catch {
        const userInfo = wx.getStorageSync('userInfo');
        if (userInfo) {
          personalInfo = { image: userInfo.avatarUrl, name: userInfo.nickName };
        }
      }
      this.setData({ isLoad: true, personalInfo });
    }
  },

  getServiceList() {
    request('/api/getServiceList').then((res) => {
      const { service } = res.data.data;
      this.setData({
        service,
      });
    });
  },

  async getPersonalInfo() {
    const info = await request('/api/genPersonalInfo').then((res) => res.data.data);
    return info;
  },

  onLogin() {
    this.setData({
      showLoginModal: true,
      tempAvatarUrl: '',
      tempNickName: '',
    });
  },

  closeLoginModal() {
    this.setData({ showLoginModal: false });
  },

  onChooseAvatar(e) {
    this.setData({ tempAvatarUrl: e.detail.avatarUrl });
  },

  onNicknameInput(e) {
    this.setData({ tempNickName: e.detail.value });
  },

  confirmLogin() {
    const { tempAvatarUrl, tempNickName } = this.data;
    if (!tempNickName) return;
    wx.setStorageSync('userInfo', { avatarUrl: tempAvatarUrl, nickName: tempNickName });
    wx.setStorageSync('access_token', 'mock-token-' + Date.now());
    this.setData({ showLoginModal: false });
    this.onShow();
  },

  onNavigateTo() {
    wx.navigateTo({
      url: `/pages/my/info-edit/index`,
    });
  },

  onEleClick(e) {
    const { name, type, url } = e.currentTarget.dataset.data;
    // 跳转到微信原生客服会话
    // 已采用 open-type='contact' 实现客服，无需 JS 跳转客服，会保留降级toast等逻辑即可
    // if (type === 'service' || name === '联系客服') {
    //   wx.openCustomerServiceChat({
    //     extInfo: { url: '' },
    //     corpId: '你的企业微信CorpID',
    //     success(res) {},
    //     fail(err) {
    //       wx.showToast({ title: '客服暂不可用', icon: 'none' });
    //     }
    //   });
    //   return;
    // }
    if (url) {
      wx.navigateTo({ url });
      return;
    }
    this.onShowToast('#t-toast', name);
  },
});

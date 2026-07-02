import request from '~/api/request';
import useToastBehavior from '~/behaviors/useToast';

Page({
  behaviors: [useToastBehavior],

  data: {
    isLoad: false,
    service: [],
    personalInfo: {},
    showContactSheet: false,
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
        name: '联系我们',
        icon: 'service',
        type: 'contact',
        phone: '400-xxx-xxxx',
        wechatId: 'contact_wechat',
      },
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
      const localInfo = wx.getStorageSync('userInfo');
      if (localInfo) {
        this.setData({
          isLoad: true,
          personalInfo: { image: localInfo.avatarUrl, name: localInfo.nickName },
        });
      } else {
        try {
          const personalInfo = await this.getPersonalInfo();
          this.setData({ isLoad: true, personalInfo });
        } catch (err) {
          console.warn('Failed to fetch personal info:', err);
        }
      }
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
    wx.setStorageSync('access_token', `mock-token-${Date.now()}`);
    this.setData({ showLoginModal: false });
    this.onShow();
  },

  onEleClick(e) {
    const { name, type, url } = e.currentTarget.dataset.data;
    if (type === 'contact') {
      this.setData({ showContactSheet: true });
      return;
    }
    if (url) {
      wx.navigateTo({ url });
      return;
    }
    this.onShowToast('#t-toast', name);
  },

  closeContactSheet() {
    this.setData({ showContactSheet: false });
  },

  onCallPhone() {
    const { phone } = this.data.settingList.find((i) => i.type === 'contact');
    wx.makePhoneCall({ phoneNumber: phone });
    this.closeContactSheet();
  },

  onCopyWechat() {
    const { wechatId } = this.data.settingList.find((i) => i.type === 'contact');
    wx.setClipboardData({
      data: wechatId,
      success: () => {
        wx.showToast({ title: '微信号已复制', icon: 'success' });
      },
    });
    this.closeContactSheet();
  },
});

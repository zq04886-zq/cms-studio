import { defineStore } from 'pinia'
export const useCouponStore = defineStore('coupon', {
 state: () => ({ coupons: { headImage: '', middleImage: '', tailImage: '', couponList: [] }, couponVisible: false, couponSingle: {}, couponSingleVisible: false }),
 actions: {
  setCoupons(value) { this.coupons = value },
  setCouponVisible(value) { this.couponVisible = value },
  setSingleCoupon(value) { this.couponSingle = value },
  setSingleCouponVisible(value) { this.couponSingleVisible = value }
 }
})

const decorateOrigin = import.meta.env.PROD ? window.location.origin : 'http://127.0.0.1:3010'
const config = {baseURL:'', jvBaseUrl:'', decorateOrigin,
 decorateViewSrc:decorateOrigin+'/crs/#/page', previewSrc:decorateOrigin+'/crs/#/activity', nodeUrl:'/atlas-cms'}

export const { baseURL, jvBaseUrl, decorateOrigin: previewOrigin, decorateViewSrc, previewSrc, nodeUrl } = config
export default config

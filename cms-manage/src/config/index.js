const decorateOrigin = process.env.NODE_ENV === 'production' ? window.location.origin : 'http://127.0.0.1:3010'
module.exports = {baseURL:'', jvBaseUrl:'', decorateOrigin,
 decorateViewSrc:decorateOrigin+'/crs/#/page', previewSrc:decorateOrigin+'/crs/#/activity', nodeUrl:'/atlas-cms'}

import {getRenderingData} from '../src/adRendering.js';
import {getNativeRenderingData, isNativeResponse} from '../src/native.js';
import {auctionManager} from '../src/auctionManager.js';
import {RENDERER} from '../libraries/creative-renderer-native/renderer.js';
import {getCreativeRendererSource} from '../src/creativeRenderers.js';

function getRenderingDataHook(next, bidResponse, options) {
  if (isNativeResponse(bidResponse)) {
    next.bail({
      native: getNativeRenderingData(bidResponse, auctionManager.index.getAdUnit(bidResponse)),
      rendererVersion: 2 // 9.28 fixed a rendering bug; this signals to PUC that the native renderer is safe to use
    })
  } else {
    next(bidResponse, options)
  }
}
function getRendererSourceHook(next, bidResponse) {
  if (isNativeResponse(bidResponse)) {
    next.bail(RENDERER);
  } else {
    next(bidResponse);
  }
}

if (FEATURES.NATIVE) {
  getRenderingData.before(getRenderingDataHook)
  getCreativeRendererSource.before(getRendererSourceHook);
}

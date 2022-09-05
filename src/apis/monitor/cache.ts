import { Method, ContentType } from 'axios-mapper'
import https from '@/utils/https'
import { CacheData } from '@/model/monitor/cache'
import { RootObject } from '@/model/rootObject'

// 查询缓存详细
export const getCache = () => {
  return https().request<RootObject<CacheData>>('monitor/cache', Method.GET, undefined, ContentType.form)
}

export interface CommandStat {
  name: string
  value: string
}
export interface CacheData {
  commandStats: CommandStat[]
  info: any
  dbSize: number
}

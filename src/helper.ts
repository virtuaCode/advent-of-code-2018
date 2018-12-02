import axios, { AxiosRequestConfig } from 'axios'
import { readFileSync } from 'fs'

export async function getInput(day: string) {
  const config: AxiosRequestConfig = {
    headers: {
      'Cookie': `session=${readFileSync('session.cookie', 'utf8')}`
    }
  }

  const { data } = await axios.get<string>(`https://adventofcode.com/2018/day/${day}/input`, config)
  return data
}

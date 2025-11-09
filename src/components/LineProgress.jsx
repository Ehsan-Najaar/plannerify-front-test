import { Line } from 'rc-progress'

export default function LineProgress({ percent }) {
  return <Line percent={percent} strokeColor="#851fd2" />
}

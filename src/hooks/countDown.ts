import { Ref } from 'vue'

export const useCountDown = (count: Ref, verifying: any) => {
  verifying.value = true
  let c = 60
  const interval = setInterval(() => {
    if (c > 0) {
      count.value = `${c--} s 后重新获取验证码`
    } else {
      count.value = '重新获取验证码'
      verifying.value = false
      clearInterval(interval)
    }
  }, 1000)
}

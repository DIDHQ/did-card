/**
 * @see https://github.com/kapetan/browser-beep
 */

import { useMemo } from 'react'

const FREQUENCY = 1920
const INTERVAL = 250
const RAMP_VALUE = 0.00001
const RAMP_DURATION = 1

export default function useBeep() {
  return useMemo(() => {
    const context = new AudioContext()

    const play = function () {
      const currentTime = context.currentTime
      const osc = context.createOscillator()
      const gain = context.createGain()

      osc.connect(gain)
      gain.connect(context.destination)

      gain.gain.setValueAtTime(gain.gain.value, currentTime)
      gain.gain.exponentialRampToValueAtTime(
        RAMP_VALUE,
        currentTime + RAMP_DURATION,
      )

      osc.onended = function () {
        gain.disconnect(context.destination)
        osc.disconnect(gain)
      }

      osc.type = 'sine'
      osc.frequency.value = FREQUENCY
      osc.start(currentTime)
      osc.stop(currentTime + RAMP_DURATION)
    }

    const beep = function (times: number = 1) {
      ;(function loop(i) {
        play()
        if (++i < times) setTimeout(loop, INTERVAL, i)
      })(0)
    }

    beep.destroy = function () {
      context.close()
    }

    return beep
  }, [])
}

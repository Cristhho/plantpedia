import { useCallback } from 'react'
import NextImage, {
  ImageLoaderProps,
  ImageProps as NextImageProps,
} from 'next/image'

export type ImageFit = 'pad' | 'fill' | 'scale' | 'crop' | 'thumb'

export type AspectRatio = '16:9' | '4:3' | '1:1' | '3:2' | '9:12'

export type ImageLayout = 'fill' | 'fixed' | 'intrinsic' | 'responsive'

type DistributiveOmit<T, K extends keyof T> = T extends unknown
  ? Omit<T, K>
  : never

type ImageProps = {
  width: number,
  height?: never,
  layout: ImageLayout,
  aspectRatio: AspectRatio,
  fit: ImageFit
} & DistributiveOmit<NextImageProps, 'height'>

export function Image({ width, fit='fill', aspectRatio, ...nextImageProps }: ImageProps) {
  const height = calcAspectRatio(aspectRatio, width)
  const loader = useCallback(
    (loaderArgs: ImageLoaderProps) => {
      const h = calcAspectRatio(aspectRatio, loaderArgs.width)

      return `${loaderArgs.src}?w=${loaderArgs.width}&h=${h}&fit=${fit}`
    },
    [aspectRatio, fit]
  )
  return <NextImage {...nextImageProps} width={width} height={height} loader={loader} />
}

const aspectRatioToRatio: Record<AspectRatio, number> = {
  '1:1': 1,
  '16:9': 9 / 16,
  '4:3': 3 / 4,
  '3:2': 2 / 3,
  '9:12': 12 / 9,
}

function calcAspectRatio(aspectRatio: AspectRatio, width: number):number {
  let ratio = aspectRatioToRatio[aspectRatio]

  return Math.floor(ratio * width)
}

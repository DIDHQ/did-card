import { GroupedVirtuoso } from 'react-virtuoso'
import NftToken from './nft-token'
import { Collection } from '@/utils/type'

const defaultLogos = [
  '/favicon.png',
  '/tako.png',
  '/moledao.png',
  '/martr1x.png',
  '/huawei.png',
]

export default function NftCollections(props: {
  collections?: Collection[]
  onSelect(image: string): void
  className?: string
}) {
  return (
    <GroupedVirtuoso
      components={{
        Header: () => (
          <div>
            <div className="flex h-16 items-center justify-between bg-gray-100 px-6 font-semibold">
              <span className="text-gray-800">Default</span>
              <span className="text-gray-400">{defaultLogos.length}</span>
            </div>
            <div className="flex flex-wrap gap-6 p-6">
              {defaultLogos.map((logo) => (
                <img
                  key={logo}
                  src={logo}
                  alt={logo}
                  onClick={() =>
                    props.onSelect(
                      `${new URL(window.location.href).origin}${logo}`,
                    )
                  }
                  className="h-32 w-32 cursor-pointer rounded-xl object-cover ring-gray-200 transition-shadow hover:ring"
                />
              ))}
            </div>
          </div>
        ),
      }}
      groupCounts={props.collections?.map(() => 1) ?? []}
      groupContent={(index) => (
        <div className="flex h-16 items-center justify-between bg-gray-100 px-6 font-semibold">
          <span className="text-gray-800">
            {props.collections?.[index]?.name}
          </span>
          <span className="text-gray-400">
            {props.collections?.[index]?.distinct_nfts_owned}
          </span>
        </div>
      )}
      itemContent={(index) => (
        <div className="flex flex-wrap gap-6 p-6">
          {props.collections?.[index]?.nft_ids.map((nftId) => (
            <NftToken
              key={nftId}
              nftId={nftId}
              onSelect={props.onSelect}
              className="p-6"
            />
          ))}
        </div>
      )}
      className={props.className}
    />
  )
}
